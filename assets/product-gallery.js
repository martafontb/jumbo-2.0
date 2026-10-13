/**
 * <product-gallery>: keeps the mobile carousel's "n / total" counter in sync
 * with the image in view. On desktop the gallery is a grid and the counter
 * is hidden.
 */
class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-gallery]');
    this.index = this.querySelector('[data-gallery-index]');
    if (!this.track || !this.index) return;
    this.track.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const width = this.track.clientWidth || 1;
      this.index.textContent = String(Math.round(this.track.scrollLeft / width) + 1);
    });
  };
}

if (!customElements.get('product-gallery')) customElements.define('product-gallery', ProductGallery);
