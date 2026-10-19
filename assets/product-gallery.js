/**
 * <product-gallery>
 * - Keeps the mobile carousel's "n / total" counter in sync with the image
 *   in view (on desktop the gallery is a grid and the counter is hidden).
 * - Zoom: the magnifier button on an image opens a lightbox (<dialog>) with
 *   arrow-key navigation and click / pointer-move zoom. Escape closes it
 *   (native dialog).
 */
class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-gallery]');
    this.index = this.querySelector('[data-gallery-index]');
    if (this.track && this.index) this.track.addEventListener('scroll', this.onScroll, { passive: true });
    this.setupZoom();
  }

  onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const width = this.track.clientWidth || 1;
      this.index.textContent = String(Math.round(this.track.scrollLeft / width) + 1);
    });
  };

  setupZoom() {
    this.dialog = this.querySelector('[data-zoom-dialog]');
    if (!this.track || !this.dialog) return;
    this.stage = this.dialog.querySelector('[data-zoom-stage]');
    this.img = this.dialog.querySelector('[data-zoom-img]');
    this.current = 0;

    this.track.addEventListener('click', (event) => {
      const button = event.target.closest('[data-zoom-src]');
      if (button) this.open(this.zoomButtons().indexOf(button));
    });

    this.stage.addEventListener('click', () => {
      this.stage.classList.toggle('is-zoomed');
    });
    this.stage.addEventListener('pointermove', (event) => {
      if (!this.stage.classList.contains('is-zoomed')) return;
      const rect = this.stage.getBoundingClientRect();
      this.stage.style.setProperty('--zoom-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      this.stage.style.setProperty('--zoom-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });

    this.dialog.querySelector('[data-zoom-close]').addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('[data-zoom-prev]').addEventListener('click', () => this.step(-1));
    this.dialog.querySelector('[data-zoom-next]').addEventListener('click', () => this.step(1));
    this.dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') this.step(-1);
      if (event.key === 'ArrowRight') this.step(1);
    });
    // Click on the backdrop (the dialog element itself) closes.
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.dialog.close();
    });
    this.dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('has-overlay');
      this.stage.classList.remove('is-zoomed');
    });
  }

  zoomButtons() {
    return [...this.track.querySelectorAll('[data-zoom-src]')];
  }

  open(index) {
    if (index < 0) return;
    this.show(index);
    this.dialog.showModal();
    document.documentElement.classList.add('has-overlay');
  }

  step(direction) {
    const count = this.zoomButtons().length;
    this.show((this.current + direction + count) % count);
  }

  show(index) {
    const buttons = this.zoomButtons();
    const button = buttons[index];
    if (!button) return;
    this.current = index;
    this.stage.classList.remove('is-zoomed');
    this.img.src = button.dataset.zoomSrc;
    this.img.alt = button.dataset.zoomAlt || '';
    const single = buttons.length < 2;
    this.dialog.querySelector('[data-zoom-prev]').hidden = single;
    this.dialog.querySelector('[data-zoom-next]').hidden = single;
  }
}

if (!customElements.get('product-gallery')) customElements.define('product-gallery', ProductGallery);
