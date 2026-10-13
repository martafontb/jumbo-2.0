import { cart, debounce, announce } from '@theme/global';

/**
 * <cart-gift>: the gift wrap checkbox adds or removes the gift wrap product
 * (the cart then re-renders), and the gift message is saved as a cart
 * attribute while the customer types.
 */
class CartGift extends HTMLElement {
  connectedCallback() {
    this.checkbox = this.querySelector('[data-gift-wrap]');
    this.messageWrap = this.querySelector('[data-gift-message-wrap]');
    this.message = this.querySelector('[data-gift-message]');
    this.status = this.querySelector('[data-gift-status]');
    this.error = this.querySelector('[data-gift-error]');
    this.checkbox?.addEventListener('change', this.onToggle);
    this.message?.addEventListener('input', this.saveMessage);
  }

  onToggle = async () => {
    const checked = this.checkbox.checked;
    const id = Number(this.dataset.variantId);
    this.setError('');
    if (checked && this.messageWrap) this.messageWrap.hidden = false;
    this.checkbox.disabled = true;
    try {
      if (checked) await cart.add({ items: [{ id, quantity: 1 }] });
      else await cart.update({ [id]: 0 });
      announce(window.JumboPress.strings?.cartUpdated || '');
    } catch (error) {
      this.checkbox.checked = !checked;
      this.setError(error.message);
    } finally {
      this.checkbox.disabled = false;
    }
  };

  saveMessage = debounce(async () => {
    try {
      await cart.attributes({ 'Gift message': this.message.value });
      if (this.status) this.status.textContent = this.dataset.savedLabel || window.JumboPress.strings?.giftSaved || '';
    } catch (error) {
      this.setError(error.message);
    }
  }, 600);

  setError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.hidden = !message;
  }
}

if (!customElements.get('cart-gift')) customElements.define('cart-gift', CartGift);
