import { prefersReducedMotion } from '@theme/global';

/**
 * <drag-scroller>: mouse drag-to-scroll for a horizontal scroll-snap row.
 * Touch and trackpads use native scrolling. A drag suppresses the click
 * that follows it, so cards aren't opened by accident. Arrow keys scroll
 * natively because the element is focusable.
 */
class DragScroller extends HTMLElement {
  connectedCallback() {
    this.addEventListener('pointerdown', this.onDown);
    this.addEventListener('click', this.onClick, true);
    this.addEventListener('dragstart', (event) => event.preventDefault());
  }

  onDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    this.startX = event.clientX;
    this.startScroll = this.scrollLeft;
    this.moved = false;
    this.lastX = event.clientX;
    this.lastT = performance.now();
    this.velocity = 0;
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp, { once: true });
  };

  onMove = (event) => {
    const dx = event.clientX - this.startX;
    if (!this.moved && Math.abs(dx) < 5) return;
    if (!this.moved) {
      this.moved = true;
      this.classList.add('is-dragging');
    }
    this.scrollLeft = this.startScroll - dx;
    // Smoothed pointer velocity (px per ms) for the flick on release.
    const now = performance.now();
    const dt = Math.max(now - this.lastT, 1);
    this.velocity = 0.8 * this.velocity + 0.2 * ((event.clientX - this.lastX) / dt);
    this.lastX = event.clientX;
    this.lastT = now;
  };

  onUp = () => {
    window.removeEventListener('pointermove', this.onMove);
    if (!this.moved) return;
    // Re-enable snapping, then let the browser settle on the nearest card.
    // Throw the row a little in the direction of the flick, then snap.
    const stale = performance.now() - this.lastT > 80;
    const throwBy = stale ? 0 : -this.velocity * 320;
    const left = this.scrollLeft;
    const target = Math.max(0, Math.min(left + throwBy, this.scrollWidth - this.clientWidth));
    this.classList.remove('is-dragging');
    this.scrollLeft = left;
    const item = [...this.children].reduce(
      (best, child) =>
        Math.abs(child.offsetLeft - this.offsetLeft - target) < Math.abs(best.offsetLeft - this.offsetLeft - target)
          ? child
          : best,
      this.children[0]
    );
    if (item) this.scrollTo({ left: item.offsetLeft - this.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  onClick = (event) => {
    if (this.moved) {
      event.preventDefault();
      event.stopPropagation();
      this.moved = false;
    }
  };
}

if (!customElements.get('drag-scroller')) customElements.define('drag-scroller', DragScroller);
