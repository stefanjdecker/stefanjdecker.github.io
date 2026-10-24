// The bouncing, spinning RDF logo over the "My Mission" box on the home page
// (ported from the custom embed on the old Google Site; the text is now real HTML).
(function () {
  const box = document.querySelector(".mission[data-logo]");
  if (!box) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  box.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const logo = new Image();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const minSpin = 0.01, maxSpin = 0.05;
  const randomSpin = () => Math.random() * (maxSpin - minSpin) + minSpin;

  let w = 0, h = 0, size = 100, logoH = 100;
  let x, y, vx = 2.5, vy = 2.5, angle = 0;
  let spin = randomSpin() * (Math.random() < 0.5 ? 1 : -1);
  let running = false, visible = true, frame = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = box.clientWidth;
    h = box.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = Math.max(48, Math.min(100, w * 0.18));
    logoH = logo.naturalWidth ? size * logo.naturalHeight / logo.naturalWidth : size;
    if (x === undefined) { x = (w - size) / 2; y = (h - logoH) / 2; }
    x = Math.max(0, Math.min(x, w - size));
    y = Math.max(0, Math.min(y, h - logoH));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(x + size / 2, y + logoH / 2);
    ctx.rotate(angle);
    ctx.drawImage(logo, -size / 2, -logoH / 2, size, logoH);
    ctx.restore();
  }

  function step() {
    x += vx;
    y += vy;
    let bounced = false;
    if (x + size >= w) { vx = -Math.abs(vx); x = w - size; bounced = true; }
    else if (x <= 0) { vx = Math.abs(vx); x = 0; bounced = true; }
    if (y + logoH >= h) { vy = -Math.abs(vy); y = h - logoH; bounced = true; }
    else if (y <= 0) { vy = Math.abs(vy); y = 0; bounced = true; }
    if (bounced) spin = (spin > 0 ? -1 : 1) * randomSpin();
    angle = (angle + spin) % (Math.PI * 2);
    draw();
    frame = requestAnimationFrame(step);
  }

  function update() {
    const shouldRun = visible && !reduceMotion.matches;
    if (shouldRun && !running) { running = true; frame = requestAnimationFrame(step); }
    if (!shouldRun && running) { running = false; cancelAnimationFrame(frame); }
    if (reduceMotion.matches) { x = w - size - 16; y = 16; angle = 0; draw(); }
  }

  logo.onload = function () {
    resize();
    new ResizeObserver(() => { resize(); if (!running) draw(); }).observe(box);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(box);
    reduceMotion.addEventListener("change", update);
    update();
  };
  logo.src = box.dataset.logo;
})();
