/**
 * <faq-list>: category chips filter the questions. The accordion itself is
 * native <details>; the theme editor opens a question when its block is
 * selected.
 */
class FaqList extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-category][aria-pressed]');
      if (chip) this.filter(chip);
    });
    document.addEventListener('shopify:block:select', (event) => {
      if (event.target.matches?.('details') && this.contains(event.target)) event.target.open = true;
    });
  }

  filter(chip) {
    const category = chip.dataset.category;
    this.querySelectorAll('[aria-pressed]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    this.querySelectorAll('details[data-category]').forEach((item) => {
      item.hidden = Boolean(category) && item.dataset.category !== category;
    });
  }
}

if (!customElements.get('faq-list')) customElements.define('faq-list', FaqList);
