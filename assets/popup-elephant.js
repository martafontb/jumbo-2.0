class PopupElephant extends HTMLElement {
  connectedCallback() {
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.svg = this.querySelector('svg');
    this.earL = this.querySelector('[data-ear-l]');
    this.earR = this.querySelector('[data-ear-r]');
    this.pupils = [...this.querySelectorAll('[data-pupil]')];
    this.lids = [...this.querySelectorAll('[data-lid]')];
    this.root = this.closest('dialog') || document;
    this.input = this.root.querySelector('input[type=email]');
    this.posted = !!this.root.querySelector('[data-posted]');
    this.mouse = null; this.focused = false; this.flapAt = 0;
    this.look = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    this.nextBlink = performance.now() + 2500;

    this.toggleAttribute('data-open', this.posted);
    if (this.input) {
      this.input.addEventListener('focus', () => { this.focused = true; this.toggleAttribute('data-open', true); });
      this.input.addEventListener('blur', () => { this.focused = false; this.toggleAttribute('data-open', this.posted); });
      this.input.addEventListener('input', () => { this.flapAt = performance.now(); });
    }
    if (this.reduce) { this.draw(0, 0); return; }

    this.onMove = (e) => { this.mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointermove', this.onMove);
    new IntersectionObserver(([en]) => {
      this.visible = en.isIntersecting;
      if (this.visible) {
        if (this.posted) this.flapAt = performance.now() + 300;
        if (!this.raf) this.raf = requestAnimationFrame(this.frame);
      }
    }).observe(this);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
  }

  draw(blink) {
    [160, 240].forEach((cx, i) => {
      this.lids[i].setAttribute('d', `M${cx - 24} 100 H${cx + 24} V${102 + blink * 46} H${cx - 24} Z`);
    });
  }

  frame = (t) => {
    if (!this.visible || !this.isConnected) { this.raf = 0; return; }
    // The SVG box is clamped by max-height, so the 400x310 viewBox is letterboxed
    // ("meet"): derive the real scale and offset instead of assuming a full-width fit.
    const r = this.svg.getBoundingClientRect();
    const k0 = Math.min(r.width / 400, r.height / 310) || 1;
    const ox = r.left + (r.width - 400 * k0) / 2, oy = r.top + (r.height - 310 * k0) / 2;
    [[160, 125], [240, 125]].forEach(([cx, cy], i) => {
      let dx = 0, dy = 0;
      if (this.focused) { dx = 0.6; dy = 0.8; }
      else if (this.mouse) {
        const px = (this.mouse.x - ox) / k0 - cx, py = (this.mouse.y - oy) / k0 - cy;
        const d = Math.hypot(px, py) || 1, k = Math.min(1, d / 120);
        dx = (px / d) * k; dy = (py / d) * k;
      }
      const L = this.look[i];
      L.x += (dx * 10 - L.x) * 0.18; L.y += (dy * 10 - L.y) * 0.18;
      this.pupils[i].setAttribute('transform', `translate(${L.x},${L.y})`);
    });

    let ang = 0;
    if (this.flapAt && t - this.flapAt > 0 && t - this.flapAt < 900) ang = Math.sin((t - this.flapAt) / 70) * 14 * (1 - (t - this.flapAt) / 900);
    else if (this.focused) ang = Math.sin(t / 260) * 3;
    this.earL.style.transform = `rotate(${-ang}deg)`;
    this.earR.style.transform = `rotate(${ang}deg)`;

    if (t > this.nextBlink) { this.blinkAt = t; this.nextBlink = t + 2500 + Math.random() * 3000; }
    const b = this.blinkAt ? Math.max(0, 1 - Math.abs((t - this.blinkAt) / 70 - 1)) : 0;
    this.draw(this.posted ? 0.45 : b);
    this.raf = requestAnimationFrame(this.frame);
  };
}
customElements.define('popup-elephant', PopupElephant);
