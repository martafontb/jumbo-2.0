import { cart, openOverlay, announce } from '@theme/global';

/**
 * <product-form> wraps a Shopify product form (`{% form 'product' %}`).
 * Without JS the form posts to /cart/add. With JS it adds through the Cart
 * API, shows "Added ✓" briefly, opens the cart drawer (when the theme uses
 * one) and reports errors inline.
 */
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.button = this.form?.querySelector('[type="submit"]');
    this.error = this.querySelector('[data-error]');
    this.form?.addEventListener('submit', this.onSubmit);
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if (this.button.getAttribute('aria-busy') === 'true') return;

    const label = this.button.querySelector('[data-label]') || this.button;
    const original = label.textContent;
    this.button.setAttribute('aria-busy', 'true');
    this.button.disabled = true;
    this.setError('');

    try {
      await cart.add(new FormData(this.form));
      const added = window.JumboPress.strings?.added || original;
      label.textContent = added;
      announce(added);

      if (window.JumboPress.settings?.cartType === 'page') {
        window.location.href = window.JumboPress.routes.cart;
        return;
      }
      const drawer = document.getElementById('CartDrawer');
      if (drawer) openOverlay(drawer, this.button);

      setTimeout(() => {
        label.textContent = original;
      }, 2000);
    } catch (error) {
      label.textContent = original;
      this.setError(error.message);
    } finally {
      this.button.removeAttribute('aria-busy');
      this.button.disabled = false;
    }
  };

  setError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.hidden = !message;
  }
}

if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);
