/**
 * <product-related data-recommendations-url>: when the section rendered
 * empty (no artist collection), fetch Shopify's recommendations for it via
 * the Section Rendering API and swap them in.
 */
class ProductRelated extends HTMLElement {
  async connectedCallback() {
    const url = this.dataset.recommendationsUrl;
    if (!url || this.children.length) return;
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const html = await response.text();
      const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('product-related');
      if (fresh?.children.length) this.replaceChildren(...fresh.children);
    } catch (error) {
      /* Recommendations are optional: leave the section empty. */
    }
  }
}

if (!customElements.get('product-related')) customElements.define('product-related', ProductRelated);
