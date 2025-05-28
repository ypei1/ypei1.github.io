(function () {
  if (document.documentElement.getAttribute("data-theme") !== "dark") return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(canvas);

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];

  document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        life: 1.0,
        radius: Math.random() * 1.5 + 0.5,
        hue: Math.floor(Math.random() * 360)
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      if (p.life <= 0) {
        particles.splice(i, 1);
        i--;
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
