(function () {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');

  function setTheme(mode) {
    html.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    if (icon) {
      icon.src = mode === 'dark'
        ? '/assets/img/icon-dark.png'
        : '/assets/img/icon-light.png';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
