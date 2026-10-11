import { openOverlay } from '@theme/global';

const SEEN_KEY = 'jumbo:newsletter-seen';

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode): the popup may show again next visit.
  }
}

/**
 * <newsletter-popup>: opens the newsletter dialog once per visitor after a
 * delay, re-opens it after the form posts (success or error), and previews
 * it when the section is selected in the theme editor.
 */
class NewsletterPopup extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    if (!this.dialog) return;
    this.dialog.addEventListener('close', markSeen);

    if (this.querySelector('[data-posted]')) {
      markSeen();
      openOverlay(this.dialog, document.body);
      return;
    }

    if (window.Shopify?.designMode) {
      this.section = this.closest('.shopify-section');
      document.addEventListener('shopify:section:select', this.onEditorSelect);
      document.addEventListener('shopify:section:deselect', this.onEditorDeselect);
      return;
    }

    if (this.hasAttribute('data-manual') || readSeen()) return;
    const delay = Number(this.dataset.delay || 3) * 1000;
    this.timer = setTimeout(this.autoOpen, delay);
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    document.removeEventListener('shopify:section:select', this.onEditorSelect);
    document.removeEventListener('shopify:section:deselect', this.onEditorDeselect);
  }

  autoOpen = () => {
    // Don't interrupt another overlay (cart, menu, search); try again shortly.
    if (document.querySelector('dialog[open]')) {
      this.timer = setTimeout(this.autoOpen, 4000);
      return;
    }
    markSeen();
    openOverlay(this.dialog, document.activeElement);
  };

  onEditorSelect = (event) => {
    if (event.target === this.section) openOverlay(this.dialog);
  };

  onEditorDeselect = (event) => {
    if (event.target === this.section && this.dialog.open) this.dialog.close();
  };
}

if (!customElements.get('newsletter-popup')) customElements.define('newsletter-popup', NewsletterPopup);
