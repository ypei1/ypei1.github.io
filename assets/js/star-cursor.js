(function () {
  function startStarCursor() {
    let stars = [];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.position = "fixed";
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    document.addEventListener("mousemove", e => {
      for (let i = 0; i < 3; i++) {
        stars.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`
        });
      }
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;
        if (s.life <= 0) {
          stars.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // 如果已是 dark mode，立即执行
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    startStarCursor();
  }

  // 听暗黑模式变化事件（支持切换后动态启用）
  const observer = new MutationObserver(() => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      if (!document.querySelector("canvas")) {
        startStarCursor();
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true });
})();
