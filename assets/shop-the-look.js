/**
 * <shop-the-look>: one hotspot card open at a time. Dots and list rows both
 * toggle a hotspot. Escape or a click outside closes it.
 */
class ShopTheLook extends HTMLElement {
  connectedCallback() {
    this.spots = [...this.querySelectorAll('[data-spot]')];
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
    document.addEventListener('click', this.onOutside);
    document.addEventListener('shopify:block:select', this.onBlockSelect);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onOutside);
    document.removeEventListener('shopify:block:select', this.onBlockSelect);
  }

  onClick = (event) => {
    const trigger = event.target.closest('[data-spot-trigger]');
    if (!trigger) return;
    const index = Number(trigger.dataset.spotTrigger);
    this.open(this.current === index ? null : index);
  };

  open(index) {
    this.spots.forEach((spot, i) => {
      const isOpen = i === index;
      spot.classList.toggle('is-open', isOpen);
      spot.querySelector('.shop-look__card').hidden = !isOpen;
      spot.querySelector('.shop-look__dot').setAttribute('aria-expanded', String(isOpen));
    });
    this.querySelectorAll('.shop-look__item').forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.spotTrigger) === index);
    });
    this.current = index;
  }

  onKeydown = (event) => {
    if (event.key !== 'Escape' || this.current == null) return;
    const dot = this.spots[this.current].querySelector('.shop-look__dot');
    this.open(null);
    dot.focus();
  };

  onOutside = (event) => {
    if (this.current != null && !this.contains(event.target)) this.open(null);
  };

  onBlockSelect = (event) => {
    const i = this.spots.indexOf(event.target.closest?.('[data-spot]'));
    if (i !== -1) this.open(i);
  };
}

if (!customElements.get('shop-the-look')) customElements.define('shop-the-look', ShopTheLook);
