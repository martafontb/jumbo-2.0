/*
 * <shipping-pill>: the bottom shipping pill. Shows unless the visitor closed
 * it during this visit (sessionStorage). Always shown in the theme editor.
 */
const STORAGE_KEY = 'jumbo:shipping-pill-closed';

class ShippingPill extends HTMLElement {
  connectedCallback() {
    this.designMode = this.hasAttribute('data-design-mode');
    if (!this.designMode && this.isClosed()) return;
    this.hidden = false;
    this.querySelector('[data-shipping-pill-close]')?.addEventListener('click', this.close);
  }

  isClosed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  close = () => {
    this.hidden = true;
    if (this.designMode) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Storage blocked: the pill stays closed on this page only.
    }
  };
}

if (!customElements.get('shipping-pill')) customElements.define('shipping-pill', ShippingPill);
