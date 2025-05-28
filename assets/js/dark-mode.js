(function () {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  function applyTheme(mode) {
    html.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
    if (icon) {
      icon.src = mode === "dark"
        ? "/assets/img/icon-dark.png"
        : "/assets/img/icon-light.png";
    }
  }

  // 页面加载时自动应用主题
  document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  });

  // 按钮点击切换主题
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
})();
