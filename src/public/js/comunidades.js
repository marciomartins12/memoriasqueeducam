(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const abas = document.querySelectorAll('.comunidades-abas .aba');
    const conteudos = document.querySelectorAll('.comunidade-conteudo');

    if (!abas.length || !conteudos.length) return;

    function ativarAba(nome) {
      abas.forEach(function (aba) {
        const ativa = aba.getAttribute('data-aba') === nome;
        aba.classList.toggle('aba-ativa', ativa);
        aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
      });

      conteudos.forEach(function (conteudo) {
        const mostrar = conteudo.getAttribute('data-conteudo') === nome;
        if (mostrar) {
          conteudo.hidden = false;
          conteudo.removeAttribute('hidden');
          conteudo.classList.remove('comunidade-conteudo-inativo');
        } else {
          conteudo.hidden = true;
          conteudo.setAttribute('hidden', '');
          conteudo.classList.add('comunidade-conteudo-inativo');
        }
      });

      const textoEl = document.querySelector(
        '.comunidade-conteudo[data-conteudo="' + nome + '"] .comunidade-texto'
      );
      if (textoEl) textoEl.scrollTop = 0;
    }

    abas.forEach(function (aba) {
      aba.addEventListener('click', function () {
        const nome = aba.getAttribute('data-aba');
        if (nome) ativarAba(nome);
      });
    });

    if (!document.querySelector('.comunidade-conteudo:not([hidden])')) {
      ativarAba('sao-felipe');
    }
  });
})();
