import { openOverlay, closeOverlay } from '@theme/global';

const CLOSE_DELAY = 180;
const DESKTOP = window.matchMedia('(min-width: 750px)');

/**
 * <site-header>
 * - Mega menus: open on hover (fine pointers) with a 180ms close delay, and
 *   on click/Enter/Space for keyboard and touch. Escape closes and returns
 *   focus. Focus leaving the trigger and panel closes them.
 * - Mobile menu: full-screen panel under the header. Makes the rest of the
 *   page inert while open, closes on Escape.
 * - Search: opens the search dialog instead of navigating to /search.
 * - Cart: opens the cart drawer when one exists and the theme setting asks
 *   for it, otherwise follows the link to /cart.
 */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.header = this.querySelector('[data-header]');
    this.triggers = [...this.querySelectorAll('[data-mega-trigger]')];
    this.mobileToggle = this.querySelector('[data-mobile-toggle]');
    this.mobileMenu = this.querySelector('[data-mobile-menu]');
    this.openPanel = null;

    this.triggers.forEach((trigger) => {
      const panel = document.getElementById(trigger.dataset.megaTrigger);
      if (!panel) return;
      trigger.addEventListener('click', () => this.toggleMega(trigger));
      trigger.addEventListener('pointerenter', (event) => this.onPointerEnter(event, trigger));
      trigger.addEventListener('pointerleave', this.scheduleClose);
      panel.addEventListener('pointerenter', this.cancelClose);
      panel.addEventListener('pointerleave', this.scheduleClose);
    });

    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('focusout', this.onFocusOut);
    this.addEventListener('click', this.onClick);
    this.mobileToggle?.addEventListener('click', () => this.toggleMobile());
    DESKTOP.addEventListener('change', this.onBreakpoint);

    document.addEventListener('shopify:block:select', this.onBlockSelect);
    document.addEventListener('shopify:block:deselect', this.onBlockDeselect);
  }

  disconnectedCallback() {
    DESKTOP.removeEventListener('change', this.onBreakpoint);
    document.removeEventListener('shopify:block:select', this.onBlockSelect);
    document.removeEventListener('shopify:block:deselect', this.onBlockDeselect);
    this.setPageInert(false);
  }

  /* ----- Mega menus ----- */

  panelFor(trigger) {
    return document.getElementById(trigger.dataset.megaTrigger);
  }

  openMega(trigger) {
    this.cancelClose();
    const panel = this.panelFor(trigger);
    if (this.openPanel === panel) return;
    this.closeMega();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    this.openPanel = panel;
    this.openTrigger = trigger;
  }

  closeMega = () => {
    if (!this.openPanel) return;
    this.openPanel.hidden = true;
    this.openTrigger.setAttribute('aria-expanded', 'false');
    this.openPanel = null;
    this.openTrigger = null;
  };

  toggleMega(trigger) {
    if (this.openTrigger === trigger) {
      this.closeMega();
    } else {
      this.openMega(trigger);
    }
  }

  onPointerEnter(event, trigger) {
    if (event.pointerType !== 'mouse') return;
    this.openMega(trigger);
  }

  scheduleClose = (event) => {
    if (event && event.pointerType && event.pointerType !== 'mouse') return;
    this.cancelClose();
    this.closeTimer = setTimeout(this.closeMega, CLOSE_DELAY);
  };

  cancelClose = () => {
    clearTimeout(this.closeTimer);
  };

  onFocusOut = (event) => {
    if (!this.openPanel) return;
    const next = event.relatedTarget;
    if (next && (this.openPanel.contains(next) || this.openTrigger.contains(next))) return;
    // Focus moved elsewhere (or left the window): close without stealing focus.
    if (next) this.closeMega();
  };

  /* ----- Mobile menu ----- */

  get mobileOpen() {
    return this.mobileToggle?.getAttribute('aria-expanded') === 'true';
  }

  toggleMobile(force) {
    const open = typeof force === 'boolean' ? force : !this.mobileOpen;
    if (open === this.mobileOpen) return;

    if (open) {
      window.scrollTo({ top: 0 });
      const headerBottom = this.header.getBoundingClientRect().bottom;
      this.mobileMenu.style.setProperty('--mobile-menu-top', `${Math.round(headerBottom + 16)}px`);
    }

    this.mobileMenu.hidden = !open;
    this.mobileToggle.setAttribute('aria-expanded', String(open));
    this.mobileToggle.querySelector('[data-toggle-label-closed]').hidden = open;
    this.mobileToggle.querySelector('[data-toggle-label-open]').hidden = !open;
    document.documentElement.classList.toggle('has-overlay', open);
    this.setPageInert(open);

    if (open) {
      this.mobileMenu.querySelector('a, button')?.focus({ preventScroll: true });
    }
  }

  /** Everything except the header bar and the menu itself is inert while the menu is open. */
  setPageInert(inert) {
    const keep = [this.header, this.mobileMenu];
    document.querySelectorAll('body > *').forEach((node) => {
      if (keep.some((el) => node.contains(el)) || node.tagName === 'SCRIPT') return;
      node.inert = inert;
    });
    // The header's own section wrapper is display: contents, so mark its other children.
    [...this.children].forEach((node) => {
      if (!keep.includes(node) && node.tagName !== 'DIALOG') node.inert = inert;
    });
  }

  onBreakpoint = () => {
    if (DESKTOP.matches) this.toggleMobile(false);
    this.closeMega();
  };

  /* ----- Shared ----- */

  /**
   * Panels live after the header in the DOM (outside the blend), so route Tab
   * explicitly: trigger → panel → next header item, and Shift+Tab back out.
   */
  routeTab(event) {
    if (!this.openPanel) return;
    const focusables = [...this.openPanel.querySelectorAll('a[href], button:not([disabled])')];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const target = event.target;

    if (target === this.openTrigger && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    } else if (target === first && event.shiftKey) {
      event.preventDefault();
      this.openTrigger.focus();
    } else if (target === last && !event.shiftKey) {
      const headerItems = [...this.header.querySelectorAll('a[href], button:not([disabled])')].filter(
        (el) => el.offsetParent !== null
      );
      const next = headerItems[headerItems.indexOf(this.openTrigger) + 1];
      if (next) {
        event.preventDefault();
        this.closeMega();
        next.focus();
      }
    }
  }

  onKeydown = (event) => {
    if (event.key === 'Tab') {
      this.routeTab(event);
      return;
    }
    if (event.key !== 'Escape') return;
    if (this.openPanel) {
      const trigger = this.openTrigger;
      this.closeMega();
      trigger.focus();
    } else if (this.mobileOpen) {
      this.toggleMobile(false);
      this.mobileToggle.focus();
    }
  };

  onClick = (event) => {
    const searchTrigger = event.target.closest('[data-search-trigger]');
    if (searchTrigger) {
      const dialog = document.getElementById('SearchOverlay');
      if (!dialog) return;
      event.preventDefault();
      this.closeMega();
      const opener = this.mobileOpen ? this.mobileToggle : searchTrigger;
      this.toggleMobile(false);
      openOverlay(dialog, opener);
      return;
    }

    const cartTrigger = event.target.closest('[data-cart-trigger]');
    if (cartTrigger && window.JumboPress.settings?.cartType === 'drawer') {
      const drawer = document.getElementById('CartDrawer');
      if (!drawer) return;
      event.preventDefault();
      this.toggleMobile(false);
      openOverlay(drawer, cartTrigger);
    }
  };

  /* ----- Theme editor: reveal the selected block's mega menu ----- */

  onBlockSelect = (event) => {
    const panel = event.target.closest?.('[data-mega-panel]');
    if (!panel || !this.contains(panel)) return;
    const trigger = this.triggers.find((node) => node.dataset.megaTrigger === panel.id);
    if (trigger) this.openMega(trigger);
  };

  onBlockDeselect = () => {
    this.closeMega();
    const search = document.getElementById('SearchOverlay');
    if (search) closeOverlay(search);
  };
}

if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
