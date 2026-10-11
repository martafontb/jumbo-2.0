/**
 * <policy-tabs>: vertical tabs over the store policies. Opens the policy in
 * the URL hash on load and keeps the hash in sync, so links can point at a
 * single policy.
 */
class PolicyTabs extends HTMLElement {
  connectedCallback() {
    this.tabs = [...this.querySelectorAll('[role="tab"]')];
    if (!this.tabs.length) return;
    const fromHash = this.tabs.find((tab) => tab.getAttribute('href') === window.location.hash);
    this.select(fromHash || this.tabs[0], false);
    this.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      event.preventDefault();
      this.select(tab, true);
    });
    this.addEventListener('keydown', this.onKeydown);
  }

  select(tab, updateHash) {
    this.tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (updateHash) history.replaceState(null, '', tab.getAttribute('href'));
  }

  onKeydown = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const i = this.tabs.indexOf(tab);
    const next = {
      ArrowUp: this.tabs[(i - 1 + this.tabs.length) % this.tabs.length],
      ArrowDown: this.tabs[(i + 1) % this.tabs.length],
      Home: this.tabs[0],
      End: this.tabs[this.tabs.length - 1],
    }[event.key];
    this.select(next, true);
    next.focus();
  };
}

if (!customElements.get('policy-tabs')) customElements.define('policy-tabs', PolicyTabs);
