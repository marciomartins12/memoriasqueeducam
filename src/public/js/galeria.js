(function () {
  'use strict';

  const body = document.body;

  const grid = document.getElementById('galeriaGrid');
  if (!grid) return;

  const filtros = document.getElementById('galeriaFiltros');
  const btnAbrirFiltro = document.querySelector('[data-galeria-abrir-filtro]');
  const botoesFiltro = document.querySelectorAll('[data-galeria-filtro]');
  const itens = grid.querySelectorAll('[data-galeria-item]');

  let filtroAtual = 'todos';

  function nomeComunidade(slug) {
    if (slug === 'santaRita') return 'Santa Rita';
    if (slug === 'saoFelipe') return 'São Felipe';
    return '';
  }

  const todasFotos = Array.from(itens).map(function (btn, i) {
    return {
      index: i,
      comunidade: btn.getAttribute('data-comunidade') || '',
      comunidadeNome: nomeComunidade(btn.getAttribute('data-comunidade') || ''),
      src: btn.getAttribute('data-src') || ''
    };
  });

  function fotosAtivas() {
    if (filtroAtual === 'todos') return todasFotos.slice();
    return todasFotos.filter(function (f) { return f.comunidade === filtroAtual; });
  }

  function aplicarFiltro(filtro) {
    filtroAtual = filtro;
    itens.forEach(function (item) {
      const comunidade = item.getAttribute('data-comunidade') || '';
      const mostrar = filtro === 'todos' || comunidade === filtro;
      if (mostrar) {
        item.hidden = false;
      } else {
        item.hidden = true;
      }
    });
    botoesFiltro.forEach(function (b) {
      const v = b.getAttribute('data-galeria-filtro');
      if (v === filtro) {
        b.classList.add('galeria-filtro-ativo');
      } else {
        b.classList.remove('galeria-filtro-ativo');
      }
    });
    reconstruirThumbs();
  }

  botoesFiltro.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const f = btn.getAttribute('data-galeria-filtro');
      if (!f) return;
      aplicarFiltro(f);
      if (filtros) filtros.hidden = false;
      if (btnAbrirFiltro) btnAbrirFiltro.setAttribute('aria-expanded', 'true');
    });
  });

  if (btnAbrirFiltro && filtros) {
    btnAbrirFiltro.addEventListener('click', function (e) {
      e.preventDefault();
      const expandido = btnAbrirFiltro.getAttribute('aria-expanded') === 'true';
      if (expandido) {
        filtros.hidden = true;
        btnAbrirFiltro.setAttribute('aria-expanded', 'false');
      } else {
        filtros.hidden = false;
        btnAbrirFiltro.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------- Lightbox ---------- */

  const lightbox = document.getElementById('galeriaLightbox');
  const lbImg = document.getElementById('galeriaLightboxImg');
  const lbComunidade = document.getElementById('galeriaLightboxComunidade');
  const lbContador = document.getElementById('galeriaLightboxContador');
  const thumbsContainer = document.getElementById('galeriaThumbs');
  const stage = document.querySelector('[data-galeria-stage]');

  let fotosNoLB = [];
  let indiceAtual = 0;
  let animando = false;
  let ultimoFoco = null;

  function reconstruirThumbs() {
    if (!thumbsContainer) return;
    thumbsContainer.innerHTML = '';
    const lista = fotosAtivas();
    lista.forEach(function (f, i) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('data-galeria-thumb', String(i));
      btn.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
      const img = document.createElement('img');
      img.src = f.src;
      img.alt = f.comunidadeNome || 'Foto';
      img.loading = 'lazy';
      img.draggable = false;
      btn.appendChild(img);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (animando) return;
        exibirFoto(i, i > indiceAtual ? 1 : (i < indiceAtual ? -1 : 0));
      });
      thumbsContainer.appendChild(btn);
    });
  }

  function atualizarThumbsAtivas() {
    if (!thumbsContainer) return;
    const lista = thumbsContainer.querySelectorAll('[data-galeria-thumb]');
    lista.forEach(function (t, i) {
      if (i === indiceAtual) {
        t.classList.add('galeria-thumb-ativa');
        try {
          t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (e) {}
      } else {
        t.classList.remove('galeria-thumb-ativa');
      }
    });
  }

  function atualizarInfo() {
    const f = fotosNoLB[indiceAtual];
    if (!f) return;
    if (lbComunidade) lbComunidade.textContent = f.comunidadeNome || '';
    if (lbContador) lbContador.textContent = (indiceAtual + 1) + ' / ' + fotosNoLB.length;
  }

  function exibirFoto(novoIndice, direcao) {
    if (!lbImg || animando) return;
    const total = fotosNoLB.length;
    if (total === 0) return;
    if (novoIndice < 0) novoIndice = total - 1;
    if (novoIndice >= total) novoIndice = 0;
    if (novoIndice === indiceAtual && lightbox.classList.contains('galeria-lightbox-aberto')) {
      atualizarThumbsAtivas();
      return;
    }

    const novaFoto = fotosNoLB[novoIndice];
    if (!novaFoto) return;

    if (!lightbox.classList.contains('galeria-lightbox-aberto') || direcao === 0) {
      lbImg.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
      lbImg.src = novaFoto.src;
      lbImg.alt = novaFoto.comunidadeNome || 'Foto';
      indiceAtual = novoIndice;
      atualizarInfo();
      atualizarThumbsAtivas();
      return;
    }

    animando = true;
    const antigaSaida = direcao > 0 ? 'saindo-esq' : 'saindo-dir';
    const novaEntrada = direcao > 0 ? 'entrando-dir' : 'entrando-esq';

    lbImg.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
    lbImg.classList.add(antigaSaida);

    setTimeout(function () {
      lbImg.classList.remove(antigaSaida);
      lbImg.classList.add(novaEntrada);
      lbImg.src = novaFoto.src;
      lbImg.alt = novaFoto.comunidadeNome || 'Foto';
      indiceAtual = novoIndice;
      atualizarInfo();
      atualizarThumbsAtivas();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lbImg.classList.remove(novaEntrada);
          setTimeout(function () { animando = false; }, 260);
        });
      });
    }, 180);
  }

  function abrirLightbox(indiceGlobal) {
    if (!lightbox) return;
    fotosNoLB = fotosAtivas();
    const ativa = fotosAtivas();
    let idx = 0;
    if (typeof indiceGlobal === 'number') {
      idx = Math.max(0, ativa.findIndex(function (f) { return f.index === indiceGlobal; }));
      if (idx < 0) idx = 0;
    }
    ultimoFoco = document.activeElement;
    reconstruirThumbs();
    indiceAtual = -1;
    exibirFoto(idx, 0);
    body.classList.add('galeria-lock');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('galeria-lightbox-aberto');
    const fechar = lightbox.querySelector('[data-galeria-lightbox-fechar]');
    if (fechar) {
      setTimeout(function () {
        try { fechar.focus(); } catch (e) {}
      }, 60);
    }
  }

  function fecharLightbox() {
    if (!lightbox) return;
    animando = false;
    body.classList.remove('galeria-lock');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('galeria-lightbox-aberto');
    if (lbImg) {
      lbImg.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
      lbImg.removeAttribute('src');
    }
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') {
      try { ultimoFoco.focus(); } catch (e) {}
    }
    ultimoFoco = null;
  }

  if (lightbox) {
    const botoesFechar = lightbox.querySelectorAll('[data-galeria-lightbox-fechar]');
    botoesFechar.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        fecharLightbox();
      });
    });

    const navs = lightbox.querySelectorAll('[data-galeria-nav]');
    navs.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (animando) return;
        const d = parseInt(b.getAttribute('data-galeria-nav'), 10) || 0;
        if (d === 0) return;
        exibirFoto(indiceAtual + d, d);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('galeria-lightbox-aberto')) return;
      if (e.key === 'Escape') {
        fecharLightbox();
      } else if (e.key === 'ArrowLeft') {
        if (animando) return;
        exibirFoto(indiceAtual - 1, -1);
      } else if (e.key === 'ArrowRight') {
        if (animando) return;
        exibirFoto(indiceAtual + 1, 1);
      }
    });
  }

  /* ---------- Swipe horizontal ---------- */

  if (stage) {
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dy = 0;
    let startT = 0;
    let swipeAtivo = false;
    let bloqueadoEixo = null;

    function pontoX(evt) {
      if (evt.touches && evt.touches[0]) return evt.touches[0].clientX;
      if (evt.changedTouches && evt.changedTouches[0]) return evt.changedTouches[0].clientX;
      if (typeof evt.clientX === 'number') return evt.clientX;
      return 0;
    }
    function pontoY(evt) {
      if (evt.touches && evt.touches[0]) return evt.touches[0].clientY;
      if (evt.changedTouches && evt.changedTouches[0]) return evt.changedTouches[0].clientY;
      if (typeof evt.clientY === 'number') return evt.clientY;
      return 0;
    }

    function onStart(evt) {
      if (!lightbox.classList.contains('galeria-lightbox-aberto')) return;
      if (animando) return;
      startX = pontoX(evt);
      startY = pontoY(evt);
      dx = 0;
      dy = 0;
      startT = Date.now();
      swipeAtivo = true;
      bloqueadoEixo = null;
      if (lbImg) {
        lbImg.style.transition = 'none';
      }
    }

    function onMove(evt) {
      if (!swipeAtivo) return;
      const x = pontoX(evt);
      const y = pontoY(evt);
      dx = x - startX;
      dy = y - startY;
      if (!bloqueadoEixo) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          bloqueadoEixo = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        }
      }
      if (bloqueadoEixo === 'x' && lbImg) {
        if (evt.cancelable) {
          try { evt.preventDefault(); } catch (e) {}
        }
        lbImg.style.transform = 'translateX(' + dx + 'px)';
        const opac = 1 - Math.min(1, Math.abs(dx) / 260) * 0.5;
        lbImg.style.opacity = String(opac);
      }
    }

    function onEnd() {
      if (!swipeAtivo) return;
      swipeAtivo = false;
      const dt = Date.now() - startT;
      const limiar = 60;
      const limiarRapido = 30;
      const tempoRapido = 260;

      if (lbImg) {
        lbImg.style.transform = '';
        lbImg.style.opacity = '';
        lbImg.style.transition = '';
      }

      if (bloqueadoEixo !== 'x') {
        bloqueadoEixo = null;
        return;
      }
      bloqueadoEixo = null;

      if (animando) return;
      const val = Math.abs(dx);
      const rapido = dt < tempoRapido && val > limiarRapido;
      const arrastado = val > limiar;
      if (rapido || arrastado) {
        if (dx < 0) {
          exibirFoto(indiceAtual + 1, 1);
        } else {
          exibirFoto(indiceAtual - 1, -1);
        }
      }
    }

    stage.addEventListener('touchstart', onStart, { passive: true });
    stage.addEventListener('touchmove', onMove, { passive: false });
    stage.addEventListener('touchend', onEnd, { passive: true });
    stage.addEventListener('touchcancel', onEnd, { passive: true });

    stage.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      onStart(e);
    });
    window.addEventListener('mousemove', function (e) {
      if (!swipeAtivo) return;
      onMove(e);
    });
    window.addEventListener('mouseup', function (e) {
      if (!swipeAtivo) return;
      onEnd();
    });
  }

  itens.forEach(function (btn, i) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      abrirLightbox(i);
    });
  });

  aplicarFiltro('todos');
})();
