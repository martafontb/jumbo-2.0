import { parseHTML, announce } from '@theme/global';

/**
 * <product-info>
 * - Resolves the selected options to a variant (JSON embedded by the picker),
 *   updates the URL and re-renders the dynamic regions ([data-dynamic]: price,
 *   buy buttons, gallery) through the Section Rendering API.
 * - Keeps focus on the picker: only its availability classes are refreshed.
 * - Size chart toggle (highlights the selected size row), guide tabs.
 * - Sticky mobile add-to-cart bar ([data-sticky-buy]): shown while the buy
 *   buttons are off screen.
 */
class ProductInfo extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId;
    this.picker = this.querySelector('[data-variant-picker]');
    const json = this.querySelector('[data-variants]');
    this.variants = json ? JSON.parse(json.textContent) : [];

    this.lastOptions = this.picker ? this.selectedOptions() : [];
    this.enableVariantInput();
    this.picker?.addEventListener('change', this.onOptionChange);
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onTabKeydown);

    if (this.querySelector('[data-sticky-buy]')) {
      this.buyObserver = new IntersectionObserver(([entry]) => {
        this.buyInView = entry.isIntersecting;
        this.syncStickyBar();
      });
      this.observeBuyButtons();
    }
  }

  disconnectedCallback() {
    this.buyObserver?.disconnect();
    document.documentElement.classList.remove('has-sticky-buy');
  }

  observeBuyButtons() {
    if (!this.buyObserver) return;
    this.buyObserver.disconnect();
    const buy = this.querySelector('.main-product__buy');
    if (buy) this.buyObserver.observe(buy);
  }

  syncStickyBar() {
    const bar = this.querySelector('[data-sticky-buy]');
    if (!bar) return;
    const show = this.buyInView === false;
    bar.hidden = false;
    bar.inert = !show;
    bar.classList.toggle('is-visible', show);
    document.documentElement.classList.add('has-sticky-buy');
  }

  /** The id input is disabled in markup so the <noscript> select wins without JS. */
  enableVariantInput() {
    this.querySelectorAll('[data-variant-input]').forEach((input) => {
      input.disabled = false;
    });
  }

  selectedOptions() {
    return [...this.picker.querySelectorAll('fieldset')].map(
      (fieldset) => fieldset.querySelector('input:checked')?.value
    );
  }

  onOptionChange = async (event) => {
    if (!event.target.matches('input[type="radio"]')) return;
    const fieldset = event.target.closest('fieldset');
    const label = fieldset.querySelector('[data-selected-value]');
    if (label) label.textContent = event.target.value;

    const options = this.selectedOptions();
    const variant = this.variants.find((v) => v.options.every((value, i) => value === options[i]));
    this.highlightSizeRow(event.target.value, fieldset);
    const previous = this.lastOptions;

    if (!variant) {
      this.setUnavailable();
      return;
    }

    const url = new URL(this.dataset.url, window.location.origin);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', `${url.pathname}${url.search}`);
    const ok = await this.render(variant.id);
    if (ok === true) this.lastOptions = options;
    else if (ok === false) this.restoreOptions(previous);
  };

  /** Put the picker, URL and labels back on the last variant that rendered. */
  restoreOptions(previous) {
    const fieldsets = [...this.picker.querySelectorAll('fieldset')];
    fieldsets.forEach((fieldset, i) => {
      const value = previous?.[i];
      const input = [...fieldset.querySelectorAll('input[type="radio"]')].find((r) => r.value === value);
      if (!input) return;
      input.checked = true;
      const label = fieldset.querySelector('[data-selected-value]');
      if (label) label.textContent = value;
      this.highlightSizeRow(value, fieldset);
    });
    const prev = this.variants.find((v) => v.options.every((value, i) => value === previous?.[i]));
    if (prev) {
      const url = new URL(this.dataset.url, window.location.origin);
      url.searchParams.set('variant', prev.id);
      window.history.replaceState({}, '', `${url.pathname}${url.search}`);
    }
  }

  async render(variantId) {
    this.controller?.abort();
    this.controller = new AbortController();
    this.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(`${this.dataset.url}?variant=${variantId}&section_id=${this.sectionId}`, {
        signal: this.controller.signal,
      });
      if (!response.ok) throw new Error(String(response.status));
      const doc = parseHTML(await response.text());

      this.querySelectorAll('[data-dynamic]').forEach((region) => {
        const fresh = doc.getElementById(region.id);
        if (fresh) region.replaceWith(fresh);
      });

      // Refresh availability on the picker without replacing it (keeps focus).
      const freshPicker = doc.querySelector('[data-variant-picker]');
      freshPicker?.querySelectorAll('label[for]').forEach((freshLabel) => {
        const current = this.picker.querySelector(`label[for="${freshLabel.htmlFor}"]`);
        if (current) current.className = freshLabel.className;
      });

      this.enableVariantInput();
      this.observeBuyButtons();
      this.syncStickyBar();
      return true;
    } catch (error) {
      // Superseded by a newer selection: nothing to report.
      if (error.name === 'AbortError') return null;
      announce(window.JumboPress.strings?.variantError || window.JumboPress.strings?.cartError || '');
      return false;
    } finally {
      this.removeAttribute('aria-busy');
    }
  }

  setUnavailable() {
    const button = this.querySelector('.buy-buttons__add');
    if (!button) return;
    button.disabled = true;
    const label = button.querySelector('[data-label]') || button;
    label.textContent = window.JumboPress.strings?.unavailable || label.textContent;
  }

  highlightSizeRow(value, fieldset) {
    fieldset.querySelectorAll('[data-size-row]').forEach((row) => {
      row.classList.toggle('is-selected', row.dataset.sizeRow === value);
    });
  }

  onClick = (event) => {
    const toggle = event.target.closest('[data-chart-toggle]');
    if (toggle) {
      const chart = document.getElementById(toggle.getAttribute('aria-controls'));
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      chart.hidden = !open;
      toggle.textContent = open ? toggle.dataset.hideLabel || toggle.textContent : toggle.dataset.showLabel || toggle.textContent;
      return;
    }

    const tab = event.target.closest('[role="tab"]');
    if (tab) this.selectTab(tab);
  };

  selectTab(tab) {
    const list = tab.closest('[role="tablist"]');
    list.querySelectorAll('[role="tab"]').forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    tab.focus();
  }

  onTabKeydown = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
    const i = tabs.indexOf(tab);
    const next = {
      ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
      ArrowRight: tabs[(i + 1) % tabs.length],
      Home: tabs[0],
      End: tabs[tabs.length - 1],
    }[event.key];
    event.preventDefault();
    this.selectTab(next);
  };
}

if (!customElements.get('product-info')) customElements.define('product-info', ProductInfo);
