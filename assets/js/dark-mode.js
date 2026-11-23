/* Lightweight theme switcher for the existing Jekyll/AcademicPages site.
   No canvas, animations, background graphics, or dependencies. */
(function () {
  'use strict';

  var html = document.documentElement;
  var key = 'theme';

  function isDark() {
    return html.getAttribute('data-theme') === 'dark';
  }

  function updateControl() {
    var button = document.getElementById('theme-toggle');
    var icon = document.getElementById('theme-icon');
    var label = document.getElementById('theme-label');
    if (!button) return;

    var dark = isDark();
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (icon) icon.textContent = dark ? '☀' : '☾';
    if (label) label.textContent = dark ? 'Light' : 'Dark';
  }

  function setTheme(theme, remember) {
    html.setAttribute('data-theme', theme);
    if (remember) {
      try { localStorage.setItem(key, theme); } catch (err) { /* storage disabled */ }
    }
    updateControl();
  }

  function init() {
    /* The tiny inline script in the head has already set the initial theme. */
    updateControl();
    var button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', function () {
        setTheme(isDark() ? 'light' : 'dark', true);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
