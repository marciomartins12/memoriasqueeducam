(function () {
  'use strict';

  const body = document.body;

  const gridFotos = document.getElementById('galeriaGrid');
  const gridVideos = document.getElementById('galeriaGridVideos');
  if (!gridFotos && !gridVideos) return;

  const filtros = document.getElementById('galeriaFiltros');
  const btnAbrirFiltro = document.querySelector('[data-galeria-abrir-filtro]');
  const botoesFiltro = document.querySelectorAll('[data-galeria-filtro]');
  const botoesAba = document.querySelectorAll('[data-galeria-tipo]');

  let filtroAtual = 'todos';
  let abaAtual = 'fotos';
  let gridAtual = gridFotos;

  // ===============================
  //  Abas: Fotos vs Vídeos
  // ===============================
  function ativarAba(tipo) {
    abaAtual = tipo === 'videos' ? 'videos' : 'fotos';
    gridAtual = abaAtual === 'videos' && gridVideos ? gridVideos : gridFotos;
    botoesAba.forEach(function (b) {
      const t = b.getAttribute('data-galeria-tipo');
      if (t === abaAtual) {
        b.classList.remove('galeria-aba-inativa');
        b.classList.add('galeria-aba-ativa');
      } else {
        b.classList.remove('galeria-aba-ativa');
        b.classList.add('galeria-aba-inativa');
      }
    });
    if (gridFotos) {
      const mostrar = abaAtual === 'fotos';
      gridFotos.hidden = !mostrar;
      gridFotos.style.setProperty('display', mostrar ? '' : 'none', 'important');
      gridFotos.setAttribute('aria-hidden', mostrar ? 'false' : 'true');
    }
    if (gridVideos) {
      const mostrar = abaAtual === 'videos';
      gridVideos.hidden = !mostrar;
      gridVideos.style.setProperty('display', mostrar ? '' : 'none', 'important');
      gridVideos.setAttribute('aria-hidden', mostrar ? 'false' : 'true');
    }
    if (btnAbrirFiltro) {
      const mostrar = abaAtual === 'fotos';
      btnAbrirFiltro.hidden = !mostrar;
      btnAbrirFiltro.style.setProperty('display', mostrar ? '' : 'none', 'important');
    }
    if (filtros) {
      const mostrar = abaAtual === 'fotos';
      filtros.hidden = !mostrar;
      filtros.style.setProperty('display', mostrar ? '' : 'none', 'important');
    }
    aplicarFiltro(filtroAtual);
  }
  botoesAba.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      const t = b.getAttribute('data-galeria-tipo');
      if (!t) return;
      ativarAba(t);
      fecharLightbox();
    });
  });

  function nomeComunidade(slug) {
    if (slug === 'santaRita') return 'Santa Rita';
    if (slug === 'saoFelipe') return 'São Felipe';
    if (slug === 'todos') return 'Memórias que Educam';
    return '';
  }

  const todasMidias = (function coletarTodasMidias() {
    const arr = [];
    const grids = [
      { grid: gridFotos, tipo: 'foto' },
      { grid: gridVideos, tipo: 'video' }
    ];
    grids.forEach(function (g) {
      if (!g.grid) return;
      const itens = g.grid.querySelectorAll('[data-galeria-item]');
      itens.forEach(function (btn, i) {
        const tipo = btn.getAttribute('data-tipo') || g.tipo;
        arr.push({
          index: i,
          tipo: tipo,
          comunidade: btn.getAttribute('data-comunidade') || '',
          comunidadeNome: nomeComunidade(btn.getAttribute('data-comunidade') || ''),
          src: btn.getAttribute('data-src') || '',
          nome: btn.getAttribute('data-galeria-nome') || ''
        });
      });
    });
    return arr;
  })();

  function midiasAtivas() {
    return todasMidias.filter(function (m) {
      if (abaAtual === 'videos') return m.tipo === 'video';
      if (filtroAtual === 'todos') return m.tipo === 'foto';
      return m.tipo === 'foto' && m.comunidade === filtroAtual;
    });
  }

  function aplicarFiltro(filtro) {
    filtroAtual = filtro;
    if (gridFotos) {
      const itens = gridFotos.querySelectorAll('[data-galeria-item]');
      itens.forEach(function (item) {
        const comunidade = item.getAttribute('data-comunidade') || '';
        const mostrar = filtro === 'todos' || comunidade === filtro;
        item.hidden = !mostrar;
      });
    }
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
      if (abaAtual !== 'fotos') return;
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
  const lbVideo = document.getElementById('galeriaLightboxVideo');
  const lbComunidade = document.getElementById('galeriaLightboxComunidade');
  const lbContador = document.getElementById('galeriaLightboxContador');
  const thumbsContainer = document.getElementById('galeriaThumbs');
  const stage = document.querySelector('[data-galeria-stage]');

  let midiasNoLB = [];
  let indiceAtual = 0;
  let animando = false;
  let ultimoFoco = null;

  function pausarVideoLB() {
    if (lbVideo && !lbVideo.hidden && typeof lbVideo.pause === 'function') {
      try { lbVideo.pause(); } catch (e) {}
    }
  }

  function reconstruirThumbs() {
    if (!thumbsContainer) return;
    thumbsContainer.innerHTML = '';
    const lista = midiasAtivas();
    if (abaAtual === 'videos') {
      thumbsContainer.hidden = true;
      return;
    } else {
      thumbsContainer.hidden = false;
    }
    lista.forEach(function (m, i) {
      if (m.tipo !== 'foto') return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('data-galeria-thumb', String(i));
      btn.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
      const img = document.createElement('img');
      img.src = m.src;
      img.alt = m.comunidadeNome || 'Foto';
      img.loading = 'lazy';
      img.draggable = false;
      btn.appendChild(img);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (animando) return;
        exibirMidia(i, i > indiceAtual ? 1 : (i < indiceAtual ? -1 : 0));
      });
      thumbsContainer.appendChild(btn);
    });
  }

  function atualizarThumbsAtivas() {
    if (!thumbsContainer || thumbsContainer.hidden) return;
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
    const m = midiasNoLB[indiceAtual];
    if (!m) return;
    if (lbComunidade) {
      lbComunidade.textContent = (m.nome && m.nome.trim()) ? m.nome : (m.comunidadeNome || '');
    }
    if (lbContador) lbContador.textContent = (indiceAtual + 1) + ' / ' + midiasNoLB.length;
  }

  function exibirMidia(novoIndice, direcao) {
    if (animando) return;
    const total = midiasNoLB.length;
    if (total === 0) return;
    if (novoIndice < 0) novoIndice = total - 1;
    if (novoIndice >= total) novoIndice = 0;
    if (novoIndice === indiceAtual && lightbox.classList.contains('galeria-lightbox-aberto')) {
      atualizarThumbsAtivas();
      return;
    }

    const nova = midiasNoLB[novoIndice];
    if (!nova) return;

    pausarVideoLB();

    if (!lightbox.classList.contains('galeria-lightbox-aberto') || direcao === 0) {
      if (lbImg) {
        lbImg.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
        lbImg.hidden = nova.tipo !== 'foto';
      }
      if (lbVideo) {
        lbVideo.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
        lbVideo.hidden = nova.tipo !== 'video';
      }
      if (nova.tipo === 'foto' && lbImg) {
        lbImg.src = nova.src;
        lbImg.alt = nova.nome || nova.comunidadeNome || 'Foto';
      } else if (nova.tipo === 'video' && lbVideo) {
        lbVideo.src = nova.src;
        lbVideo.setAttribute('poster', '');
        lbVideo.currentTime = 0;
        try {
          const prom = lbVideo.play();
          if (prom && typeof prom.catch === 'function') prom.catch(function () {});
        } catch (e) {}
      }
      indiceAtual = novoIndice;
      atualizarInfo();
      atualizarThumbsAtivas();
      return;
    }

    animando = true;
    const antigaSaida = direcao > 0 ? 'saindo-esq' : 'saindo-dir';
    const novaEntrada = direcao > 0 ? 'entrando-dir' : 'entrando-esq';

    const elAntigo = (midiasNoLB[indiceAtual] && midiasNoLB[indiceAtual].tipo === 'video') ? lbVideo : lbImg;
    const elNovo = (nova.tipo === 'video') ? lbVideo : lbImg;

    if (elAntigo) {
      elAntigo.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
      elAntigo.classList.add(antigaSaida);
    }

    setTimeout(function () {
      if (elAntigo) {
        elAntigo.classList.remove(antigaSaida);
        elAntigo.hidden = elAntigo !== elNovo;
      }
      if (elNovo) {
        elNovo.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
        elNovo.classList.add(novaEntrada);
        elNovo.hidden = false;
        if (nova.tipo === 'foto' && lbImg) {
          lbImg.src = nova.src;
          lbImg.alt = nova.nome || nova.comunidadeNome || 'Foto';
        } else if (nova.tipo === 'video' && lbVideo) {
          lbVideo.src = nova.src;
          lbVideo.currentTime = 0;
          try {
            const prom = lbVideo.play();
            if (prom && typeof prom.catch === 'function') prom.catch(function () {});
          } catch (e) {}
        }
      }
      indiceAtual = novoIndice;
      atualizarInfo();
      atualizarThumbsAtivas();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (elNovo) elNovo.classList.remove(novaEntrada);
          setTimeout(function () { animando = false; }, 260);
        });
      });
    }, 180);
  }

  function abrirLightbox(indiceGlobal) {
    if (!lightbox) return;
    midiasNoLB = midiasAtivas();
    const ativa = midiasAtivas();
    let idx = 0;
    if (typeof indiceGlobal === 'number') {
      idx = Math.max(0, ativa.findIndex(function (m) { return m.index === indiceGlobal; }));
      if (idx < 0) idx = 0;
    }
    ultimoFoco = document.activeElement;
    reconstruirThumbs();
    indiceAtual = -1;
    exibirMidia(idx, 0);
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
    pausarVideoLB();
    body.classList.remove('galeria-lock');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('galeria-lightbox-aberto');
    if (lbImg) {
      lbImg.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
      lbImg.removeAttribute('src');
    }
    if (lbVideo) {
      lbVideo.classList.remove('saindo-esq', 'saindo-dir', 'entrando-esq', 'entrando-dir');
      lbVideo.removeAttribute('src');
      lbVideo.load && lbVideo.load();
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
        exibirMidia(indiceAtual + d, d);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('galeria-lightbox-aberto')) return;
      if (e.key === 'Escape') {
        fecharLightbox();
      } else if (e.key === 'ArrowLeft') {
        if (animando) return;
        exibirMidia(indiceAtual - 1, -1);
      } else if (e.key === 'ArrowRight') {
        if (animando) return;
        exibirMidia(indiceAtual + 1, 1);
      } else if (e.key === ' ') {
        if (lbVideo && !lbVideo.hidden) {
          e.preventDefault();
          if (lbVideo.paused) {
            try { lbVideo.play(); } catch (e) {}
          } else {
            try { lbVideo.pause(); } catch (e) {}
          }
        }
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
      // não ativa swipe em vídeo (evita conflito com controles)
      if (lbVideo && !lbVideo.hidden) return;
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
          exibirMidia(indiceAtual + 1, 1);
        } else {
          exibirMidia(indiceAtual - 1, -1);
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

  [gridFotos, gridVideos].forEach(function (g) {
    if (!g) return;
    const itens = g.querySelectorAll('[data-galeria-item]');
    itens.forEach(function (btn, i) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        abrirLightbox(i);
      });
    });
  });

  ativarAba('fotos');
})();
