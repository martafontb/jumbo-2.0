class NewsletterElephant extends HTMLElement {
  connectedCallback() {
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.svg = this.querySelector('svg');
    this.earL = this.querySelector('[data-ear-l]');
    this.earR = this.querySelector('[data-ear-r]');
    this.pupils = [...this.querySelectorAll('[data-pupil]')];
    this.lids = [...this.querySelectorAll('[data-lid]')];
    this.form = this.querySelector('form');
    this.input = this.querySelector('input[type=email]');
    this.btn = this.querySelector('[data-submit]');
    this.msg = this.querySelector('[data-msg]');
    this.btnLabel = this.btn.textContent;
    this.mouse = null; this.focused = false; this.done = false; this.flapAt = 0;
    this.look = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    this.nextBlink = performance.now() + 2500;

    this.onMove = (e) => { this.mouse = { x: e.clientX, y: e.clientY }; };
    this.input.addEventListener('focus', () => { this.focused = true; this.sync(); });
    this.input.addEventListener('blur', () => { this.focused = false; this.sync(); });
    this.input.addEventListener('input', () => { this.flapAt = performance.now(); });
    this.form.addEventListener('submit', (e) => this.submit(e));

    if (!this.reduce) {
      window.addEventListener('pointermove', this.onMove);
      new IntersectionObserver(([en]) => {
        this.visible = en.isIntersecting;
        if (this.visible && !this.raf) this.raf = requestAnimationFrame(this.frame);
      }).observe(this);
    }
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
  }

  sync() { this.toggleAttribute('data-open', this.focused || this.done); }

  async submit(e) {
    e.preventDefault();
    this.btn.disabled = true;
    try {
      const res = await fetch(this.form.action, { method: 'POST', body: new FormData(this.form), headers: { Accept: 'text/html' } });
      if (!res.ok) throw new Error();
      this.done = true;
      this.flapAt = performance.now();
      this.msg.textContent = this.dataset.success || 'You are on the list.';
      this.btn.textContent = '✓';
      this.form.reset();
      this.sync();
      setTimeout(() => { this.done = false; this.btn.textContent = this.btnLabel; this.sync(); }, 3500);
    } catch {
      this.msg.textContent = 'Something went wrong. Try again.';
    }
    this.btn.disabled = false;
  }

  frame = (t) => {
    if (!this.visible || !this.isConnected) { this.raf = 0; return; }
    const r = this.svg.getBoundingClientRect(), s = 400 / r.width;
    [[160, 125], [240, 125]].forEach(([cx, cy], i) => {
      let dx = 0, dy = 0;
      if (this.focused) dy = 1;
      else if (this.mouse) {
        const px = (this.mouse.x - r.left) * s - cx, py = (this.mouse.y - r.top) * s - cy;
        const d = Math.hypot(px, py) || 1, k = Math.min(1, d / 120);
        dx = (px / d) * k; dy = (py / d) * k;
      }
      const L = this.look[i];
      L.x += (dx * 10 - L.x) * 0.18; L.y += (dy * 10 - L.y) * 0.18;
      this.pupils[i].setAttribute('transform', `translate(${L.x},${L.y})`);
    });

    let ang = 0;
    if (this.flapAt && t - this.flapAt < 900) ang = Math.sin((t - this.flapAt) / 70) * 14 * (1 - (t - this.flapAt) / 900);
    else if (this.focused) ang = Math.sin(t / 260) * 3;
    this.earL.style.transform = `rotate(${-ang}deg)`;
    this.earR.style.transform = `rotate(${ang}deg)`;

    if (t > this.nextBlink) { this.blinkAt = t; this.nextBlink = t + 2500 + Math.random() * 3000; }
    const b = this.blinkAt ? Math.max(0, 1 - Math.abs((t - this.blinkAt) / 70 - 1)) : 0;
    const a = this.done ? 0.45 : b;
    [160, 240].forEach((cx, i) => {
      this.lids[i].setAttribute('d', `M${cx - 24} 100 H${cx + 24} V${102 + a * 46} H${cx - 24} Z`);
    });
    this.raf = requestAnimationFrame(this.frame);
  };
}
customElements.define('newsletter-elephant', NewsletterElephant);
