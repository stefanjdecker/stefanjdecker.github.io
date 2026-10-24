// Small enhancements; every page works without JavaScript.

// Click-to-load YouTube: swap the placeholder for the player only when asked,
// so visitors who never press play send nothing to YouTube.
document.querySelectorAll("a[data-youtube]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.youtube}?autoplay=1`;
    frame.title = link.querySelector(".video-title").textContent;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    link.replaceWith(frame);
    frame.focus();
  });
});

// The bouncing, spinning RDF logo from the old Google Site, now behind a toggle
// in the "My mission" section.
(function () {
  const section = document.querySelector("[data-rdf-logo]");
  const toggle = section && section.querySelector(".rdf-toggle");
  if (!toggle) return;

  const minSpin = 0.01, maxSpin = 0.05;
  const randomSpin = () => Math.random() * (maxSpin - minSpin) + minSpin;
  let canvas, ctx, logo, frame = 0, running = false;
  let w = 0, h = 0, size = 100, logoH = 100, x, y, vx = 2.5, vy = 2.5, angle = 0, spin = randomSpin();

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = section.clientWidth;
    h = section.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = Math.max(56, Math.min(100, w * 0.15));
    logoH = size * logo.naturalHeight / logo.naturalWidth;
    if (x === undefined) {
      const box = toggle.getBoundingClientRect(), outer = section.getBoundingClientRect();
      x = box.left - outer.left; y = box.top - outer.top;
    }
    x = Math.max(0, Math.min(x, w - size));
    y = Math.max(0, Math.min(y, h - logoH));
  }

  function step() {
    x += vx; y += vy;
    let bounced = false;
    if (x + size >= w) { vx = -Math.abs(vx); x = w - size; bounced = true; }
    else if (x <= 0) { vx = Math.abs(vx); x = 0; bounced = true; }
    if (y + logoH >= h) { vy = -Math.abs(vy); y = h - logoH; bounced = true; }
    else if (y <= 0) { vy = Math.abs(vy); y = 0; bounced = true; }
    if (bounced) spin = (spin > 0 ? -1 : 1) * randomSpin();
    angle = (angle + spin) % (Math.PI * 2);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(x + size / 2, y + logoH / 2);
    ctx.rotate(angle);
    ctx.drawImage(logo, -size / 2, -logoH / 2, size, logoH);
    ctx.restore();
    frame = requestAnimationFrame(step);
  }

  async function loadLogo() {
    // Recolour the logo with the current accent colour, so it also suits dark mode.
    const accent = getComputedStyle(section).getPropertyValue("--accent").trim() || "#00579c";
    const svg = (await (await fetch(section.dataset.rdfLogo)).text()).replace(/fill="#00579c"/g, `fill="${accent}"`);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    await img.decode();
    return img;
  }

  async function start() {
    if (!logo) logo = await loadLogo();
    if (running || toggle.getAttribute("aria-pressed") !== "true") return;
    canvas = document.createElement("canvas");
    canvas.className = "rdf-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    running = true;
    frame = requestAnimationFrame(step);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
    canvas.remove();
    x = undefined;
  }

  toggle.addEventListener("click", () => {
    const on = toggle.getAttribute("aria-pressed") !== "true";
    toggle.setAttribute("aria-pressed", String(on));
    if (on) start(); else stop();
  });
  window.addEventListener("resize", () => { if (running) resize(); });
})();
