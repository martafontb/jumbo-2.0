/**
 * <quantity-input>: − / + buttons around a number input. Respects min, max
 * and step (Shopify quantity rules) and fires a bubbling `change` event.
 */
class QuantityInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    this.addEventListener('click', this.onClick);
    this.input?.addEventListener('change', () => this.clamp());
    this.syncButtons();
  }

  get min() {
    return Number(this.input.min || 0);
  }

  get max() {
    return this.input.max ? Number(this.input.max) : Infinity;
  }

  get step() {
    return Number(this.input.step || 1);
  }

  onClick = (event) => {
    const button = event.target.closest('[data-step]');
    if (!button || button.disabled) return;
    const delta = button.dataset.step === 'up' ? this.step : -this.step;
    this.input.value = Number(this.input.value || 0) + delta;
    this.clamp();
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  clamp() {
    let value = Number(this.input.value || this.min);
    value = Math.min(Math.max(value, this.min), this.max);
    this.input.value = value;
    this.syncButtons();
  }

  syncButtons() {
    if (!this.input) return;
    const value = Number(this.input.value);
    const down = this.querySelector('[data-step="down"]');
    const up = this.querySelector('[data-step="up"]');
    if (down) down.disabled = value - this.step < this.min;
    if (up) up.disabled = value + this.step > this.max;
  }
}

if (!customElements.get('quantity-input')) customElements.define('quantity-input', QuantityInput);
