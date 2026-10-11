import { prefersReducedMotion } from '@theme/global';

/**
 * <auto-video>: a muted, looping background video with a pause/play button.
 * Starts paused under reduced motion and pauses while off screen; a video the
 * visitor paused stays paused.
 */
class AutoVideo extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('video');
    this.toggle = this.querySelector('[data-video-toggle]');
    if (!this.video) return;
    this.userPaused = prefersReducedMotion();
    if (this.userPaused) this.video.pause();

    this.toggle?.addEventListener('click', () => {
      this.userPaused = !this.video.paused;
      if (this.userPaused) this.video.pause();
      else this.video.play().catch(() => {});
    });
    this.video.addEventListener('play', this.sync);
    this.video.addEventListener('pause', this.sync);

    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) this.video.pause();
      else if (!this.userPaused) this.video.play().catch(() => {});
    });
    this.observer.observe(this);
    this.sync();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  sync = () => {
    if (!this.toggle) return;
    const paused = this.video.paused;
    this.toggle.setAttribute('aria-label', paused ? this.dataset.playLabel : this.dataset.pauseLabel);
    this.toggle.querySelector('[data-icon-pause]').hidden = paused;
    this.toggle.querySelector('[data-icon-play]').hidden = !paused;
  };
}

if (!customElements.get('auto-video')) customElements.define('auto-video', AutoVideo);
