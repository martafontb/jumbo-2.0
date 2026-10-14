import { copyText, announce, prefersReducedMotion } from '@theme/global';

const STORAGE_KEY = 'jumbo:announcement-dismissed';

class AnnouncementBar extends HTMLElement {
  connectedCallback() {
    this.slides = [...this.querySelectorAll('.announcement__slide')];
    this.index = 0;
    this.interval = Number(this.dataset.interval) || 5000;
    this.designMode = this.hasAttribute('data-design-mode');
    this.toggle = this.querySelector('[data-announcement-toggle]');
    // A user pause (or reduced motion) holds until the user resumes.
    this.userPaused = prefersReducedMotion();

    if (!this.designMode && this.isDismissed()) {
      this.classList.add('is-dismissed');
      return;
    }

    if (this.toggle && this.slides.length > 1) {
      this.toggle.hidden = false;
      this.syncToggle();
    }
    this.addEventListener('click', this.onClick);
    this.addEventListener('mouseenter', this.pause);
    this.addEventListener('mouseleave', this.play);
    this.addEventListener('focusin', this.pause);
    this.addEventListener('focusout', this.play);
    document.addEventListener('shopify:block:select', this.onBlockSelect);
    document.addEventListener('shopify:block:deselect', this.play);
    this.play();
  }

  disconnectedCallback() {
    this.pause();
    document.removeEventListener('shopify:block:select', this.onBlockSelect);
    document.removeEventListener('shopify:block:deselect', this.play);
  }

  isDismissed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  play = () => {
    this.pause();
    if (this.slides.length < 2 || this.userPaused) return;
    this.timer = setInterval(() => this.show(this.index + 1), this.interval);
  };

  pause = () => {
    clearInterval(this.timer);
  };

  syncToggle() {
    const paused = this.userPaused;
    this.toggle.setAttribute('aria-label', paused ? this.toggle.dataset.playLabel : this.toggle.dataset.pauseLabel);
    this.toggle.setAttribute('aria-pressed', String(paused));
    this.toggle.querySelector('[data-icon-pause]').hidden = paused;
    this.toggle.querySelector('[data-icon-play]').hidden = !paused;
  }

  show(index) {
    const next = (index + this.slides.length) % this.slides.length;
    if (next === this.index) return;
    this.slides[this.index].hidden = true;
    this.slides[next].hidden = false;
    this.slides[next].classList.remove('is-entering');
    void this.slides[next].offsetWidth; // restart the fade animation
    this.slides[next].classList.add('is-entering');
    this.index = next;
  }

  onBlockSelect = (event) => {
    const slide = this.slides.findIndex((node) => node.contains(event.target) || node === event.target);
    if (slide === -1) return;
    this.pause();
    this.show(slide);
  };

  onClick = async (event) => {
    if (event.target.closest('[data-announcement-toggle]')) {
      this.userPaused = !this.userPaused;
      this.syncToggle();
      this.play();
      return;
    }

    if (event.target.closest('[data-announcement-close]')) {
      this.pause();
      this.classList.add('is-dismissed');
      if (!this.designMode) {
        try {
          sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (error) {
          /* storage unavailable: dismissal lasts for this page view */
        }
      }
      document.dispatchEvent(new CustomEvent('jumbo:announcement-dismissed'));
      return;
    }

    const copyButton = event.target.closest('[data-copy-code]');
    if (!copyButton) return;
    const ok = await copyText(copyButton.dataset.copyCode);
    if (!ok) return;
    const label = copyButton.querySelector('[data-message-text]');
    const original = label.textContent;
    label.textContent = copyButton.dataset.copiedText;
    announce(copyButton.dataset.copiedText);
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      label.textContent = original;
    }, 2500);
  };
}

if (!customElements.get('announcement-bar')) customElements.define('announcement-bar', AnnouncementBar);
