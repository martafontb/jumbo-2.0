/**
 * Print guide components.
 * - <ink-picker>: radio-style swatches recolour the big field (arrow keys move).
 * - <check-list>: tick-off rows (visual only, nothing is stored).
 * - <process-steps>: vertical tab list for "How it is made".
 * - <overprint-simulator>: two drum inks + misregistration slider.
 */

function rovingKeys(event, items, onSelect, vertical = false) {
  const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  const all = [...keys, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!all.includes(event.key)) return;
  const i = items.indexOf(event.target.closest('[role="radio"], [role="tab"]'));
  if (i === -1) return;
  event.preventDefault();
  const back = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
  let next = back ? i - 1 : i + 1;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = items.length - 1;
  next = (next + items.length) % items.length;
  onSelect(items[next]);
  items[next].focus();
}

class InkPicker extends HTMLElement {
  connectedCallback() {
    this.swatches = [...this.querySelectorAll('[role="radio"]')];
    this.field = this.querySelector('[data-ink-field]');
    this.name = this.querySelector('[data-ink-name]');
    this.note = this.querySelector('[data-ink-note]');
    this.addEventListener('click', (event) => {
      const swatch = event.target.closest('[role="radio"]');
      if (swatch) this.select(swatch);
    });
    this.addEventListener('keydown', (event) => rovingKeys(event, this.swatches, (s) => this.select(s)));
    this.addEventListener('shopify:block:select', (event) => {
      if (this.swatches.includes(event.target)) this.select(event.target);
    });
  }

  select(swatch) {
    this.swatches.forEach((s) => {
      const on = s === swatch;
      s.setAttribute('aria-checked', String(on));
      s.tabIndex = on ? 0 : -1;
    });
    this.field.style.setProperty('--ink', swatch.dataset.color);
    this.name.textContent = swatch.dataset.name;
    this.note.textContent = swatch.dataset.note;
  }
}

class CheckList extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-check]');
      if (!toggle) return;
      const done = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(done));
      toggle.closest('li').classList.toggle('is-done', done);
    });
  }
}

class ProcessSteps extends HTMLElement {
  connectedCallback() {
    this.tabs = [...this.querySelectorAll('[role="tab"]')];
    this.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) this.select(tab);
    });
    this.addEventListener('keydown', (event) => rovingKeys(event, this.tabs, (t) => this.select(t), true));
    this.addEventListener('shopify:block:select', (event) => {
      if (this.tabs.includes(event.target)) this.select(event.target);
    });
  }

  select(tab) {
    this.tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
}

class OverprintSimulator extends HTMLElement {
  connectedCallback() {
    this.offset = this.querySelector('[data-offset]');
    this.names = this.querySelector('[data-names]');
    this.addEventListener('input', this.update);
    this.addEventListener('change', this.update);
  }

  update = () => {
    const a = this.querySelector('[data-drum="1"]:checked');
    const b = this.querySelector('[data-drum="2"]:checked');
    const reg = this.querySelector('[data-reg]').value;
    if (a) this.style.setProperty('--ink-a', a.value);
    if (b) this.style.setProperty('--ink-b', b.value);
    this.style.setProperty('--reg', reg);
    this.offset.textContent = (this.dataset.offsetLabel || '[n]').replace('[n]', reg);
    if (a && b) this.names.textContent = `${a.dataset.name} + ${b.dataset.name}`;
  };
}

const define = (name, element) => !customElements.get(name) && customElements.define(name, element);
define('ink-picker', InkPicker);
define('check-list', CheckList);
define('process-steps', ProcessSteps);
define('overprint-simulator', OverprintSimulator);
