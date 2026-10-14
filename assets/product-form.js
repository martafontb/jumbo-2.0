import { cart, openOverlay, announce, formatMoney } from '@theme/global';

/**
 * <product-form> wraps a Shopify product form (`{% form 'product' %}`).
 * Without JS the form posts to /cart/add. With JS it adds through the Cart
 * API, briefly shows the "added" label, reveals the "View cart (n)" link,
 * opens the cart drawer (when the theme uses one) and reports errors inline.
 * An optional [data-total] on the button tracks price × quantity.
 */
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    if (!this.form) return;
    this.button = this.form.querySelector('[type="submit"]');
    this.error = this.querySelector('[data-error]');
    this.form.addEventListener('submit', this.onSubmit);
    this.form.addEventListener('change', this.onChange);
  }

  onChange = (event) => {
    if (event.target.name !== 'quantity') return;
    const total = this.querySelector('[data-total]');
    if (!total || !this.dataset.price) return;
    const quantity = Number(event.target.value) || 1;
    total.textContent = formatMoney(Number(this.dataset.price) * quantity, this.dataset.moneyFormat);
  };

  onSubmit = async (event) => {
    event.preventDefault();
    if (this.button.getAttribute('aria-busy') === 'true') return;

    // A button elsewhere can submit this form with form="…" (e.g. the sticky
    // mobile bar); it mirrors the main button's busy and "added" states.
    const buttons = [this.button];
    if (event.submitter && event.submitter !== this.button) buttons.push(event.submitter);
    const labels = buttons.map((button) => button.querySelector('[data-label]') || button);
    const originals = labels.map((label) => label.innerHTML);
    const restore = () => labels.forEach((label, i) => (label.innerHTML = originals[i]));
    buttons.forEach((button) => {
      button.setAttribute('aria-busy', 'true');
      button.setAttribute('aria-disabled', 'true');
    });
    this.setError('');

    try {
      await cart.add(new FormData(this.form));
      const added = this.dataset.addedLabel || window.JumboPress.strings?.added || '';
      if (added) labels.forEach((label) => (label.textContent = added));
      announce(added);
      this.querySelector('[data-view-cart]')?.removeAttribute('hidden');

      if (window.JumboPress.settings?.cartType === 'page') {
        window.location.href = window.JumboPress.routes.cart;
        return;
      }
      const drawer = document.getElementById('CartDrawer');
      if (drawer) openOverlay(drawer, buttons[buttons.length - 1]);

      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(restore, 2500);
    } catch (error) {
      restore();
      this.setError(error.message);
      if (buttons.length > 1) announce(error.message);
    } finally {
      buttons.forEach((button) => {
        button.removeAttribute('aria-busy');
        button.removeAttribute('aria-disabled');
      });
    }
  };

  setError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.hidden = !message;
  }
}

if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);
