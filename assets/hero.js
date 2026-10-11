/**
 * <hero-section>: pause/play control for the autoplaying hero video.
 * Starts paused under reduced motion.
 */
class HeroSection extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('.hero__video');
    this.toggle = this.querySelector('[data-hero-toggle]');
    if (!this.video || !this.toggle) return;

    this.toggle.addEventListener('click', () => (this.video.paused ? this.play() : this.pause()));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.pause();
    this.video.addEventListener('play', () => this.sync());
    this.video.addEventListener('pause', () => this.sync());
    this.sync();
  }

  play() {
    this.video.play().catch(() => {});
  }

  pause() {
    this.video.pause();
  }

  sync() {
    const paused = this.video.paused;
    this.toggle.setAttribute('aria-label', paused ? this.dataset.playLabel || 'Play' : this.dataset.pauseLabel || 'Pause');
    this.toggle.querySelector('[data-icon-pause]').hidden = paused;
    this.toggle.querySelector('[data-icon-play]').hidden = !paused;
  }
}

if (!customElements.get('hero-section')) customElements.define('hero-section', HeroSection);
