class JumboLogo extends HTMLElement {
  connectedCallback() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    const wrap = this.closest('.nav-in');
    if (wrap) setTimeout(() => wrap.classList.add('nav-in--done'), 1200);

    this.els = [...this.querySelectorAll('[data-letter]')];
    this.P = this.els.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, sx: 1, sy: 1, vsx: 0, vsy: 0, over: false }));
    this.mouse = null;
    this.running = false;

    this.addEventListener('pointermove', (e) => {
      this.mouse = { x: e.clientX, y: e.clientY };
      this.start();
    });
    this.addEventListener('pointerleave', () => {
      this.mouse = null;
      this.start();
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame(this.step);
  }

  hop(i, v) {
    const p = this.P[i];
    p.vy -= v; p.vsy += 2; p.vsx -= 1;
  }

  step = (t) => {
    const dt = Math.min(0.033, (t - this.last) / 1000);
    this.last = t;
    const R = this.els.map((e) => e.getBoundingClientRect());
    const u = this.getBoundingClientRect().width / 1400;
    let energy = 0;

    this.P.forEach((p, i) => {
      const r = R[i];
      let tsx = 1, tsy = 1, tx = 0;
      if (this.mouse) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(this.mouse.x - cx, this.mouse.y - cy);
        const k = Math.max(0, 1 - d / (r.width * 1.1));
        const inside = this.mouse.x > r.left && this.mouse.x < r.right && this.mouse.y > r.top && this.mouse.y < r.bottom;
        if (inside && !p.over) this.hop(i, 420 * u * 3);
        p.over = inside;
        tsx = tsy = 1 + 0.22 * k;
        tx = -(this.mouse.x - cx) * 0.12 * k;
      } else p.over = false;

      this.P.forEach((q, j) => { if (j !== i) tx += Math.sign(i - j) * (q.sx - 1) * R[j].width * 0.35; });

      p.vx += ((tx - p.x) * 140 - p.vx * 9) * dt; p.x += p.vx * dt;
      p.vy += (-p.y * 140 - p.vy * 9) * dt; p.y += p.vy * dt;
      if (p.y > 0) { p.y = 0; p.vy *= -0.45; }
      p.vsx += ((tsx - p.sx) * 220 - p.vsx * 11) * dt; p.sx += p.vsx * dt;
      p.vsy += ((tsy - p.sy) * 220 - p.vsy * 11) * dt; p.sy += p.vsy * dt;
      if (p.y === 0 && Math.abs(p.vy) > 200 * u) { p.vsy -= Math.abs(p.vy) * 0.004 / (3 * u); p.vsx += Math.abs(p.vy) * 0.002 / (3 * u); }

      this.els[i].style.transform = `translate(${p.x}px,${p.y}px) scale(${p.sx},${p.sy})`;
      energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.vsx) + Math.abs(p.vsy) + Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.sx - 1) + Math.abs(p.sy - 1);
    });

    if (this.mouse || energy > 0.05) requestAnimationFrame(this.step);
    else {
      this.els.forEach((e) => (e.style.transform = ''));
      this.running = false;
    }
  };
}
customElements.define('jumbo-logo', JumboLogo);
