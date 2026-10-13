/**
 * Jumbo Press — shared runtime.
 *
 * - Overlays: native <dialog> drawers, modals and sheets (focus containment,
 *   Escape, scrim click, focus return, scroll lock).
 * - Cart API client: wraps /cart/*.js with the Section Rendering API and
 *   dispatches `cart:updated` on document.
 * - Small helpers shared by feature modules (announce, copy, debounce).
 *
 * Exposed on window.JumboPress so feature modules and apps can reuse it.
 */

const JumboPress = (window.JumboPress = window.JumboPress || {});

/* ---------- Helpers ---------- */

export function debounce(fn, wait = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function announce(message) {
  const region = document.querySelector('[data-live-region]');
  if (!region) return;
  region.textContent = '';
  // A fresh text node after a tick makes screen readers re-announce repeats.
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Format cents with a Shopify money format string, e.g. "£{{amount}}".
 * Supports the standard placeholders Shopify stores use.
 */
export function formatMoney(cents, format = '{{amount}}') {
  const value = Number(cents) / 100;
  const group = (number, decimals, thousands, decimal) => {
    const [whole, fraction] = number.toFixed(decimals).split('.');
    const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return fraction ? `${withThousands}${decimal}${fraction}` : withThousands;
  };
  return format.replace(/\{\{\s*(\w+)\s*\}\}/, (_, key) => {
    switch (key) {
      case 'amount_no_decimals':
        return group(value, 0, ',', '.');
      case 'amount_with_comma_separator':
        return group(value, 2, '.', ',');
      case 'amount_no_decimals_with_comma_separator':
        return group(value, 0, '.', ',');
      case 'amount_with_apostrophe_separator':
        return group(value, 2, "'", '.');
      case 'amount_with_space_separator':
        return group(value, 2, ' ', ',');
      default:
        return group(value, 2, ',', '.');
    }
  });
}

/* ---------- Overlays ---------- */

const openers = new WeakMap();

function syncScrollLock() {
  const anyOpen = document.querySelector('dialog.overlay[open]');
  document.documentElement.classList.toggle('has-overlay', Boolean(anyOpen));
}

export function openOverlay(dialog, opener = document.activeElement) {
  if (!dialog || dialog.open) return;
  openers.set(dialog, opener);
  dialog.showModal();
  syncScrollLock();
  const autofocus = dialog.querySelector('[autofocus]');
  if (autofocus) autofocus.focus();
  dialog.dispatchEvent(new CustomEvent('jumbo:overlay-open', { bubbles: true }));
}

export function closeOverlay(dialog) {
  if (!dialog || !dialog.open) return;
  // Drawers slide back out before closing (skipped under reduced motion).
  if (dialog.classList.contains('drawer') && !prefersReducedMotion()) {
    if (dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    const finish = () => {
      clearTimeout(fallback);
      dialog.classList.remove('is-closing');
      dialog.close();
    };
    const fallback = setTimeout(finish, 400);
    dialog.addEventListener('animationend', (event) => event.target === dialog && finish(), { once: true });
    return;
  }
  dialog.close();
}

// Esc on a drawer: run the same slide-out instead of closing at once.
document.addEventListener(
  'cancel',
  (event) => {
    const dialog = event.target;
    if (dialog instanceof HTMLDialogElement && dialog.classList.contains('drawer')) {
      event.preventDefault();
      closeOverlay(dialog);
    }
  },
  true
);

function onDialogClose(event) {
  const dialog = event.target;
  if (!(dialog instanceof HTMLDialogElement) || !dialog.classList.contains('overlay')) return;
  syncScrollLock();
  const opener = openers.get(dialog);
  if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  dialog.dispatchEvent(new CustomEvent('jumbo:overlay-close', { bubbles: true }));
}

document.addEventListener('close', onDialogClose, true);

// Scrim click: a click whose target is the <dialog> itself landed on ::backdrop.
document.addEventListener('click', (event) => {
  const dialog = event.target;
  if (dialog instanceof HTMLDialogElement && dialog.classList.contains('overlay') && dialog.open) {
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) closeOverlay(dialog);
  }
});

// Declarative triggers: <button data-overlay-open="DialogId"> and <button data-overlay-close>.
document.addEventListener('click', (event) => {
  const openTrigger = event.target.closest('[data-overlay-open]');
  if (openTrigger) {
    const dialog = document.getElementById(openTrigger.dataset.overlayOpen);
    if (dialog) {
      event.preventDefault();
      openOverlay(dialog, openTrigger);
    }
    return;
  }
  const closeTrigger = event.target.closest('[data-overlay-close]');
  if (closeTrigger) {
    event.preventDefault();
    closeOverlay(closeTrigger.closest('dialog'));
  }
});

// Forms marked data-auto-submit submit when a select changes (e.g. collection sort).
document.addEventListener('change', (event) => {
  const form = event.target.closest('form[data-auto-submit]');
  if (form && event.target.matches('select')) form.requestSubmit();
});

/* ---------- Cart API ---------- */

class CartError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'CartError';
    this.status = status;
  }
}

async function cartRequest(url, body, sections = []) {
  const isForm = body instanceof FormData;
  if (sections.length) {
    if (isForm) {
      body.append('sections', sections.join(','));
      body.append('sections_url', window.location.pathname);
    } else {
      body.sections = sections.join(',');
      body.sections_url = window.location.pathname;
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: isForm
        ? { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        : { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: isForm ? body : JSON.stringify(body),
    });
  } catch (networkError) {
    throw new CartError(JumboPress.strings?.cartError || 'Something went wrong.', 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status) {
    throw new CartError(
      data.description || data.message || JumboPress.strings?.cartError || 'Something went wrong.',
      response.status
    );
  }
  return data;
}

export const cart = {
  /** Section IDs to re-render after every mutation (registered by sections). */
  sections: new Set(),

  async get() {
    const response = await fetch(`${JumboPress.routes.cart}.js`, { headers: { Accept: 'application/json' } });
    return response.json();
  },

  /** @param {FormData|{items: Array}} body */
  async add(body) {
    const data = await cartRequest(`${JumboPress.routes.cartAdd}.js`, body, [...this.sections]);
    await this.refresh(data.sections, 'add', data);
    return data;
  },

  async change(line, quantity) {
    const data = await cartRequest(`${JumboPress.routes.cartChange}.js`, { line, quantity }, [...this.sections]);
    this.dispatch(data, data.sections, 'change');
    return data;
  },

  async update(updates) {
    const data = await cartRequest(`${JumboPress.routes.cartUpdate}.js`, { updates }, [...this.sections]);
    this.dispatch(data, data.sections, 'update');
    return data;
  },

  /** Cart attributes (e.g. a gift message); Shopify copies them to the order. Nothing re-renders. */
  async attributes(attributes) {
    return cartRequest(`${JumboPress.routes.cartUpdate}.js`, { attributes });
  },

  /** /cart/add.js returns the added items, not the cart, so fetch the cart afterwards. */
  async refresh(sections, source = 'refresh', added = null) {
    const cartState = await this.get();
    this.dispatch(cartState, sections, source, added);
    return cartState;
  },

  dispatch(cartState, sections, source, added = null) {
    document.dispatchEvent(
      new CustomEvent('cart:updated', { detail: { cart: cartState, sections: sections || {}, source, added } })
    );
  },
};

// Other scripts (apps, custom code) can ask the theme to re-sync the cart.
document.addEventListener('cart:refresh', () => {
  cart.refresh(null).catch(() => {});
});

// Header cart counts.
document.addEventListener('cart:updated', (event) => {
  const count = event.detail.cart?.item_count;
  if (typeof count !== 'number') return;
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = count;
  });
});

Object.assign(JumboPress, {
  debounce,
  announce,
  formatMoney,
  copyText,
  parseHTML,
  prefersReducedMotion,
  openOverlay,
  closeOverlay,
  cart,
  CartError,
});
