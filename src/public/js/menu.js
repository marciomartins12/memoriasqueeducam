(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const btnAbrir = document.getElementById('btnAbrirMenu');
    const btnFechar = document.getElementById('btnFecharMenu');
    const menu = document.getElementById('menuLateral');

    if (!menu || !btnAbrir) return;

    function abrirMenu() {
      menu.classList.add('aberto');
      menu.setAttribute('aria-hidden', 'false');
      btnAbrir.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function fecharMenu() {
      menu.classList.remove('aberto');
      menu.setAttribute('aria-hidden', 'true');
      if (btnAbrir) btnAbrir.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    if (btnAbrir) btnAbrir.addEventListener('click', abrirMenu);
    if (btnFechar) btnFechar.addEventListener('click', fecharMenu);

    menu.querySelectorAll('[data-fechar-menu]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (el.classList.contains('menu-overlay') || e.currentTarget.tagName === 'A') {
          fecharMenu();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) fecharMenu();
    });
  });
})();
