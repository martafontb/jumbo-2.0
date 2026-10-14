import { prefersReducedMotion } from '@theme/global';

/**
 * <quote-rotator> cycles through child [data-quote] items.
 * Optional controls: [data-prev], [data-next], [data-counter] ("n / N").
 * Auto-advances every data-interval ms (0 = manual only), pausing on hover
 * and focus, and never auto-advancing under reduced motion.
 * Optional [data-rotator-toggle] (with data-play-label / data-pause-label) is a
 * pause/play button; a user pause holds until the user resumes.
 */
class QuoteRotator extends HTMLElement {
  connectedCallback() {
    this.items = [...this.querySelectorAll('[data-quote]')];
    if (this.items.length < 2) return;
    this.index = Math.max(0, this.items.findIndex((item) => !item.hidden));
    this.interval = Number(this.dataset.interval || 0);
    this.counter = this.querySelector('[data-counter]');
    this.toggle = this.querySelector('[data-rotator-toggle]');
    this.userPaused = prefersReducedMotion();
    if (this.toggle) {
      this.toggle.hidden = false;
      this.toggle.addEventListener('click', () => {
        this.userPaused = !this.userPaused;
        this.syncToggle();
        this.start();
      });
      this.syncToggle();
    }

    this.querySelector('[data-prev]')?.addEventListener('click', () => this.go(this.index - 1, true));
    this.querySelector('[data-next]')?.addEventListener('click', () => this.go(this.index + 1, true));
    this.addEventListener('mouseenter', this.stop);
    this.addEventListener('mouseleave', this.start);
    this.addEventListener('focusin', this.stop);
    this.addEventListener('focusout', this.start);
    document.addEventListener('shopify:block:select', this.onBlockSelect);
    this.updateCounter();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
    document.removeEventListener('shopify:block:select', this.onBlockSelect);
  }

  start = () => {
    this.stop();
    if (!this.interval || this.userPaused) return;
    this.timer = setInterval(() => this.go(this.index + 1), this.interval);
  };

  syncToggle() {
    const paused = this.userPaused;
    this.toggle.setAttribute('aria-label', paused ? this.toggle.dataset.playLabel : this.toggle.dataset.pauseLabel);
    this.toggle.setAttribute('aria-pressed', String(paused));
    this.toggle.querySelector('[data-icon-pause]').hidden = paused;
    this.toggle.querySelector('[data-icon-play]').hidden = !paused;
  }

  stop = () => clearInterval(this.timer);

  go(index, fromUser = false) {
    const next = (index + this.items.length) % this.items.length;
    this.items[this.index].hidden = true;
    this.items[next].hidden = false;
    this.items[next].classList.remove('is-entering');
    void this.items[next].offsetWidth;
    this.items[next].classList.add('is-entering');
    this.index = next;
    this.updateCounter();
    if (fromUser) this.start();
  }

  updateCounter() {
    if (this.counter) this.counter.textContent = `${this.index + 1} / ${this.items.length}`;
  }

  onBlockSelect = (event) => {
    const i = this.items.findIndex((item) => item.contains(event.target));
    if (i !== -1) {
      this.stop();
      this.go(i);
    }
  };
}

if (!customElements.get('quote-rotator')) customElements.define('quote-rotator', QuoteRotator);
