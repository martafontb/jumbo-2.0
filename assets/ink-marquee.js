/**
 * <ink-marquee>: pause/play button for the scrolling ink row. The CSS also
 * pauses it on hover and focus, and stops it under reduced motion.
 */
class InkMarquee extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('[data-marquee-toggle]');
    this.toggle?.addEventListener('click', () => {
      this.classList.toggle('is-paused');
      this.sync();
    });
    this.sync();
  }

  sync() {
    if (!this.toggle) return;
    const paused = this.classList.contains('is-paused');
    this.toggle.setAttribute('aria-label', paused ? this.dataset.playLabel : this.dataset.pauseLabel);
    this.toggle.querySelector('[data-icon-pause]').hidden = paused;
    this.toggle.querySelector('[data-icon-play]').hidden = !paused;
  }
}

if (!customElements.get('ink-marquee')) customElements.define('ink-marquee', InkMarquee);
