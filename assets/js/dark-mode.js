(function () {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');
    const storedTheme = localStorage.getItem('theme');

  function setTheme(mode) {
    html.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    if (icon) {
      icon.src = mode === 'dark'
        ? '/assets/img/icon-dark.png'
        : '/assets/img/icon-light.png';
    }
  }

  if (storedTheme) {
    html.setAttribute('data-theme', storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
  }
  
toggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
