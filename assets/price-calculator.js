import { formatMoney } from '@theme/global';

/**
 * <price-calculator>: live estimate from size (unit rate in cents), colours
 * and run. total = run × unit × colours + setup × colours. The quote link
 * gets the chosen options as query parameters so a contact form can show
 * them.
 */
class PriceCalculator extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.totalEl = this.querySelector('[data-total]');
    this.eachEl = this.querySelector('[data-each]');
    this.runOutput = this.querySelector('[data-run-output]');
    this.link = this.querySelector('[data-quote-link]');
    this.baseHref = this.link?.getAttribute('href');
    this.form.addEventListener('input', this.update);
    this.form.addEventListener('submit', (event) => event.preventDefault());
    this.update();
  }

  update = () => {
    const data = new FormData(this.form);
    const unit = Number(data.get('size'));
    const colours = Number(data.get('colours'));
    const run = Number(data.get('run'));
    const setup = Number(this.dataset.setup || 0);
    const total = run * unit * colours + setup * colours;
    const format = this.dataset.moneyFormat;

    this.runOutput.textContent = run;
    this.totalEl.textContent = formatMoney(Math.round(total / 100) * 100, format).replace(/[.,]00(?=\D*$)/, '');
    this.eachEl.textContent = formatMoney(Math.round(total / run), format);

    if (this.link && this.baseHref) {
      const url = new URL(this.baseHref, window.location.origin);
      const size = this.form.querySelector('input[name="size"]:checked')?.dataset.label;
      if (size) url.searchParams.set('size', size);
      url.searchParams.set('colours', colours);
      url.searchParams.set('run', run);
      this.link.href = `${url.pathname}${url.search}`;
    }
  };
}

if (!customElements.get('price-calculator')) customElements.define('price-calculator', PriceCalculator);
