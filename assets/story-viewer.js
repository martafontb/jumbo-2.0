import { openOverlay } from '@theme/global';

const IMAGE_DURATION = 5000;

/**
 * <story-viewer>: opens the stories dialog at the tapped tile, shows one
 * slide at a time with progress bars, and auto-advances (unless the visitor
 * prefers reduced motion). Left third = previous, rest = next; arrow keys
 * work too. Closing stops playback.
 */
class StoryViewer extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    this.slides = [...this.querySelectorAll('[data-story-slide]')];
    this.bars = [...this.querySelectorAll('[data-story-bar]')];
    this.headTime = this.querySelector('[data-story-head-time]');
    if (!this.dialog || !this.slides.length) return;

    this.addEventListener('click', this.onClick);
    this.dialog.addEventListener('keydown', this.onKeydown);
    this.dialog.addEventListener('close', this.stop);
  }

  get reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  onClick = (event) => {
    const opener = event.target.closest('[data-story-open]');
    if (opener) {
      openOverlay(this.dialog, opener);
      this.show(Number(opener.dataset.storyOpen));
      return;
    }
    if (event.target.closest('[data-story-prev]')) this.show(this.index - 1);
    if (event.target.closest('[data-story-next]')) this.next();
  };

  onKeydown = (event) => {
    if (event.key === 'ArrowLeft') this.show(this.index - 1);
    if (event.key === 'ArrowRight') this.next();
  };

  next() {
    if (this.index >= this.slides.length - 1) {
      this.dialog.close();
      return;
    }
    this.show(this.index + 1);
  }

  show(index) {
    this.stop();
    this.index = Math.min(Math.max(index, 0), this.slides.length - 1);

    this.slides.forEach((slide, i) => {
      slide.hidden = i !== this.index;
    });
    this.bars.forEach((bar, i) => {
      bar.style.width = i < this.index ? '100%' : '0%';
    });

    const slide = this.slides[this.index];
    if (this.headTime) {
      const time = slide.querySelector('[data-story-time]')?.textContent.trim();
      this.headTime.textContent = time ? ` · ${time}` : '';
    }

    const video = slide.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
      video.onended = () => this.next();
    }

    if (this.reducedMotion) {
      this.bars[this.index].style.width = '100%';
      return;
    }

    const start = performance.now();
    const step = (now) => {
      const duration = video && video.duration ? video.duration * 1000 : IMAGE_DURATION;
      const progress = video && video.duration ? video.currentTime / video.duration : (now - start) / duration;
      this.bars[this.index].style.width = `${Math.min(progress, 1) * 100}%`;
      if (progress >= 1 && !video) {
        this.next();
        return;
      }
      this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  stop = () => {
    cancelAnimationFrame(this.frame);
    this.slides.forEach((slide) => {
      const video = slide.querySelector('video');
      if (video) {
        video.pause();
        video.onended = null;
      }
    });
  };
}

if (!customElements.get('story-viewer')) customElements.define('story-viewer', StoryViewer);
