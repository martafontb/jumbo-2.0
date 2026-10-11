/**
 * <artists-index>: hover/focus a row to preview that artist; kind chips
 * filter the list.
 * <artist-editions>: ink chips filter the artist's editions.
 */
class ArtistsIndex extends HTMLElement {
  connectedCallback() {
    this.cards = [...this.querySelectorAll('[data-preview-card]')];
    this.addEventListener('pointerover', this.onPreview);
    this.addEventListener('focusin', this.onPreview);
    this.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-kind][aria-pressed]');
      if (!chip) return;
      const kind = chip.dataset.kind;
      this.querySelectorAll('[aria-pressed]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      this.querySelectorAll('li[data-kind]').forEach((item) => {
        item.hidden = Boolean(kind) && item.dataset.kind !== kind;
      });
    });
  }

  onPreview = (event) => {
    const row = event.target.closest('[data-preview]');
    if (!row) return;
    this.querySelectorAll('[data-preview].is-active').forEach((r) => r.classList.remove('is-active'));
    row.classList.add('is-active');
    this.cards.forEach((card) => {
      card.hidden = card.dataset.previewCard !== row.dataset.preview;
    });
  };
}

class ArtistEditions extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-ink][aria-pressed]');
      if (!chip) return;
      const ink = chip.dataset.ink;
      this.querySelectorAll('[aria-pressed]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      this.querySelectorAll('[data-inks]').forEach((item) => {
        item.hidden = Boolean(ink) && !item.dataset.inks.split(' ').includes(ink);
      });
    });
  }
}

if (!customElements.get('artists-index')) customElements.define('artists-index', ArtistsIndex);
if (!customElements.get('artist-editions')) customElements.define('artist-editions', ArtistEditions);
