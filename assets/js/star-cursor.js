(function () {
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  if (!isDark()) return;

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
  const ctx = canvas.getContext('2d');
  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.02;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
