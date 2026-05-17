(function () {
  "use strict";

  const canvas = document.createElement("canvas");
  canvas.id = "galaxy-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });

  let width = 0;
  let height = 0;
  let dpr = 1;

  let stars = [];
  let galaxyStars = [];
  let meteors = [];
  let lastMeteorTime = 0;
  let nextMeteorDelay = 1200;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createStars();
    createGalaxyStars();
  }

  function createStars() {
    const count = Math.min(700, Math.max(220, Math.floor((width * height) / 2600)));
    stars = [];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rand(0.35, 1.45),
        alpha: rand(0.25, 0.95),
        twinkle: rand(0.0015, 0.006),
        speed: rand(0.01, 0.055),
        hue: Math.random() > 0.75 ? rand(210, 270) : rand(35, 60)
      });
    }
  }

  function createGalaxyStars() {
    galaxyStars = [];

    const cx = width * 0.18;
    const cy = height * 0.24;
    const count = 420;

    for (let i = 0; i < count; i++) {
      const arm = i % 2 === 0 ? 0 : Math.PI;
      const radius = Math.pow(Math.random(), 0.65) * Math.min(width, height) * 0.27;
      const angle = radius * 0.045 + arm + rand(-0.65, 0.65);

      const x = cx + Math.cos(angle) * radius * 1.55 + rand(-9, 9);
      const y = cy + Math.sin(angle) * radius * 0.58 + rand(-9, 9);

      galaxyStars.push({
        x,
        y,
        r: rand(0.35, 1.9),
        alpha: rand(0.18, 0.85),
        drift: rand(0.0005, 0.002)
      });
    }
  }

  function drawBackground(t) {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#02040d");
    bg.addColorStop(0.35, "#050817");
    bg.addColorStop(0.65, "#080515");
    bg.addColorStop(1, "#03020a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawNebula(width * 0.82, height * 0.52, width * 0.42, "rgba(130, 75, 255,", t, 0.00009);
    drawNebula(width * 0.88, height * 0.74, width * 0.34, "rgba(255, 95, 205,", t, 0.00012);
    drawNebula(width * 0.18, height * 0.22, width * 0.30, "rgba(80, 120, 255,", t, 0.00008);
    drawNebula(width * 0.42, height * 0.82, width * 0.36, "rgba(60, 190, 255,", t, 0.00006);
  }

  function drawNebula(cx, cy, radius, colorPrefix, t, speed) {
    const dx = Math.sin(t * speed) * 28;
    const dy = Math.cos(t * speed * 0.8) * 20;

    const g = ctx.createRadialGradient(cx + dx, cy + dy, 0, cx + dx, cy + dy, radius);
    g.addColorStop(0, colorPrefix + "0.28)");
    g.addColorStop(0.33, colorPrefix + "0.13)");
    g.addColorStop(0.62, colorPrefix + "0.055)");
    g.addColorStop(1, colorPrefix + "0)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars(t) {
    for (const s of stars) {
      s.y += s.speed;
      if (s.y > height + 4) {
        s.y = -4;
        s.x = Math.random() * width;
      }

      const glow = s.alpha + Math.sin(t * s.twinkle + s.x) * 0.28;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue}, 95%, 82%, ${Math.max(0.08, Math.min(1, glow))})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawGalaxy(t) {
    const cx = width * 0.18;
    const cy = height * 0.24;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.33 + Math.sin(t * 0.00012) * 0.035);
    ctx.scale(1.65, 0.62);

    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.15);
    core.addColorStop(0, "rgba(255, 235, 210, 0.48)");
    core.addColorStop(0.28, "rgba(175, 130, 255, 0.24)");
    core.addColorStop(0.72, "rgba(80, 110, 255, 0.08)");
    core.addColorStop(1, "rgba(80, 110, 255, 0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    for (const p of galaxyStars) {
      const pulse = p.alpha + Math.sin(t * p.drift + p.x * 0.01) * 0.18;
      ctx.beginPath();
      ctx.fillStyle = `rgba(210, 215, 255, ${Math.max(0.06, Math.min(0.9, pulse))})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function spawnMeteor() {
    const fromRight = Math.random() > 0.45;

    const x = fromRight ? rand(width * 0.55, width * 1.05) : rand(-width * 0.05, width * 0.45);
    const y = rand(-height * 0.08, height * 0.78);

    const angle = fromRight ? rand(2.35, 2.62) : rand(0.58, 0.82);
    const speed = rand(7.0, 12.5);

    meteors.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: rand(120, 260),
      life: 0,
      maxLife: rand(55, 95),
      width: rand(1.1, 2.4)
    });
  }

  function drawMeteors(t) {
    if (t - lastMeteorTime > nextMeteorDelay) {
      spawnMeteor();
      lastMeteorTime = t;
      nextMeteorDelay = rand(900, 2800);
    }

    meteors = meteors.filter((m) => {
      m.x += m.vx;
      m.y += m.vy;
      m.life += 1;

      const tailX = m.x - m.vx * m.len * 0.035;
      const tailY = m.y - m.vy * m.len * 0.035;

      const fade = 1 - m.life / m.maxLife;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`);
      grad.addColorStop(0.12, `rgba(130, 205, 255, ${0.7 * fade})`);
      grad.addColorStop(1, "rgba(130, 205, 255, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * fade})`;
      ctx.arc(m.x, m.y, m.width * 1.3, 0, Math.PI * 2);
      ctx.fill();

      return (
        m.life < m.maxLife &&
        m.x > -350 &&
        m.x < width + 350 &&
        m.y > -350 &&
        m.y < height + 350
      );
    });
  }

  function drawOverlay() {
    const vignette = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.15,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.72
    );

    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(0.65, "rgba(0, 0, 0, 0.10)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.62)");

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function animate(t) {
    drawBackground(t);
    drawGalaxy(t);
    drawStars(t);
    drawMeteors(t);
    drawOverlay();

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });

  resizeCanvas();
  requestAnimationFrame(animate);
})();
