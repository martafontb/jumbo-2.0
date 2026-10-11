import { copyText, announce } from '@theme/global';

/**
 * <article-page>: reading progress bar and the "Copy link" button.
 */
class ArticlePage extends HTMLElement {
  connectedCallback() {
    this.bar = this.querySelector('[data-progress]');
    this.content = this.querySelector('.main-article__content') || this;
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
    this.querySelector('[data-copy-link]')?.addEventListener('click', this.onCopy);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const rect = this.content.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const read = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      this.bar?.parentElement.style.setProperty('--read', read.toFixed(3));
    });
  };

  onCopy = async (event) => {
    const button = event.currentTarget;
    const ok = await copyText(window.location.href.split('#')[0]);
    if (!ok) return;
    const original = button.textContent;
    button.textContent = button.dataset.copied;
    announce(button.dataset.copied);
    setTimeout(() => {
      button.textContent = original;
    }, 2500);
  };
}

if (!customElements.get('article-page')) customElements.define('article-page', ArticlePage);
