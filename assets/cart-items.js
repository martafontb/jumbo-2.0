import { cart, announce, debounce, parseHTML } from '@theme/global';

/**
 * <cart-items data-section="…"> — the cart drawer content or the cart page.
 * - Registers its section with the Cart API client so every cart mutation
 *   returns fresh HTML for it (Section Rendering API), then swaps it in.
 * - Quantity changes (debounced) and Remove go through /cart/change.js. The
 *   stepper shows the new value straight away; on error the line shows the
 *   message and the section re-renders from the server (rollback).
 * - Focus stays on the control that was used where it still exists.
 */
class CartItems extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.section;
    cart.sections.add(this.sectionId);
    this.addEventListener('change', this.onChange);
    this.addEventListener('click', this.onClick);
    document.addEventListener('cart:updated', this.onCartUpdated);
  }

  disconnectedCallback() {
    document.removeEventListener('cart:updated', this.onCartUpdated);
  }

  onChange = debounce((event) => {
    const input = event.target.closest('[data-line-quantity]');
    if (!input) return;
    const line = input.closest('[data-line]');
    this.update(Number(line.dataset.line), Number(input.value), line);
  }, 300);

  onClick = (event) => {
    const remove = event.target.closest('[data-remove]');
    if (!remove) return;
    event.preventDefault();
    const line = remove.closest('[data-line]');
    this.update(Number(line.dataset.line), 0, line);
  };

  async update(lineIndex, quantity, lineEl) {
    lineEl?.setAttribute('aria-busy', 'true');
    try {
      await cart.change(lineIndex, quantity);
      // cart:updated (dispatched by the client) re-renders every registered section.
    } catch (error) {
      await this.refresh();
      const fresh = this.querySelector(`[data-line="${lineIndex}"] [data-line-error]`);
      if (fresh) {
        fresh.textContent = error.message;
        fresh.hidden = false;
      }
      announce(error.message);
    }
  }

  onCartUpdated = (event) => {
    const html = event.detail.sections?.[this.sectionId];
    if (html) {
      this.render(html);
    } else {
      this.refresh();
    }
  };

  async refresh() {
    try {
      const response = await fetch(`${window.location.pathname}?sections=${encodeURIComponent(this.sectionId)}`);
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      if (data[this.sectionId]) this.render(data[this.sectionId]);
    } catch (error) {
      // Leave the current markup and tell the customer.
      announce(window.JumboPress.strings?.cartError || '');
    }
  }

  render(html) {
    const fresh = parseHTML(html).querySelector('cart-items');
    if (!fresh) return;
    const activeId = this.contains(document.activeElement) ? document.activeElement.id : null;
    const activeLine = document.activeElement?.closest?.('[data-line]')?.dataset.line;

    this.innerHTML = fresh.innerHTML;

    const target =
      (activeId && this.querySelector(`#${CSS.escape(activeId)}`)) ||
      (activeLine && this.querySelector(`[data-line="${activeLine}"] [data-line-quantity]`)) ||
      (activeLine && this.querySelector('[data-line-quantity], [data-overlay-close], a'));
    target?.focus({ preventScroll: true });

    const status = this.querySelector('[data-cart-status]');
    if (status) announce(window.JumboPress.strings?.cartUpdated || '');
  }
}

if (!customElements.get('cart-items')) customElements.define('cart-items', CartItems);
