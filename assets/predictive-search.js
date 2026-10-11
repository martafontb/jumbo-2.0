import { debounce, announce } from '@theme/global';

/**
 * <predictive-search> — live results inside the search overlay.
 * Fetches the `predictive-search` section from /search/suggest and swaps it
 * into the results container. The initial "trending" markup is restored
 * when the input is cleared.
 */
class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input[type="search"]');
    this.results = this.querySelector('[data-results]');
    this.emptyTemplate = this.querySelector('[data-empty-template]');
    this.initialMarkup = this.results.innerHTML;
    this.cache = new Map();

    this.input.addEventListener('input', this.onInput);
    this.addEventListener('click', this.onClick);
  }

  onInput = debounce(() => this.search(this.input.value.trim()), 200);

  onClick = (event) => {
    const chip = event.target.closest('[data-search-suggestion]');
    if (!chip) return;
    this.input.value = chip.dataset.searchSuggestion;
    this.input.focus();
    this.search(this.input.value);
  };

  async search(terms) {
    this.controller?.abort();

    if (!terms) {
      this.results.innerHTML = this.initialMarkup;
      return;
    }

    if (this.cache.has(terms)) {
      this.render(this.cache.get(terms), terms);
      return;
    }

    this.controller = new AbortController();
    const params = new URLSearchParams({
      q: terms,
      section_id: 'predictive-search',
      'resources[type]': 'product,collection,page,article',
      'resources[limit]': '6',
      'resources[limit_scope]': 'each',
      'resources[options][unavailable_products]': 'last',
      'resources[options][fields]': 'title,product_type,variants.title,vendor,tag,body',
    });

    this.results.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(`${window.JumboPress.routes.predictiveSearch}?${params}`, {
        signal: this.controller.signal,
      });
      if (!response.ok) throw new Error(String(response.status));
      const html = await response.text();
      this.cache.set(terms, html);
      this.render(html, terms);
    } catch (error) {
      if (error.name === 'AbortError') return;
      // Network or API failure: keep the form usable, Enter still goes to /search.
      this.results.innerHTML = '';
    } finally {
      this.results.removeAttribute('aria-busy');
    }
  }

  render(html, terms) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const payload = doc.querySelector('[data-predictive-results]');
    const count = Number(payload?.dataset.count || 0);

    if (count > 0) {
      this.results.replaceChildren(...payload.childNodes);
      const label = this.results.querySelector('.search-results__count');
      if (label) announce(label.textContent);
      return;
    }

    const empty = this.emptyTemplate.content.cloneNode(true);
    empty.querySelector('[data-empty-terms]').textContent = terms;
    this.results.replaceChildren(empty);
    announce(this.results.textContent.trim());
  }
}

if (!customElements.get('predictive-search')) customElements.define('predictive-search', PredictiveSearch);
