(function () {
  'use strict';

  const body = document.body;
  const modal = document.getElementById('saberesModal');
  if (!modal) return;

  const overlay = modal.querySelector('.saberes-modal-overlay');
  const painel = modal.querySelector('.saberes-modal-painel');
  const btnFechar = modal.querySelector('.saberes-modal-fechar');
  const titulo = document.getElementById('saberesModalTitulo');
  const corpo = document.getElementById('saberesModalCorpo');
  const botoesFechar = modal.querySelectorAll('[data-saberes-modal-fechar]');

  const slider = document.getElementById('saberesModalSlider');
  const btnPrev = slider ? slider.querySelector('[data-slider-prev]') : null;
  const btnNext = slider ? slider.querySelector('[data-slider-next]') : null;
  const viewport = document.getElementById('saberesSliderViewport');
  const track = document.getElementById('saberesSliderTrack');
  const dotsContainer = document.getElementById('saberesSliderDots');

  let ultimoFoco = null;
  let currentSlide = 0;
  let totalSlides = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let slideWidth = 0;
  let modalVideoEl = null;

  function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = String(texto == null ? '' : texto);
    return div.innerHTML;
  }

  function quebrarParagrafos(texto) {
    const txt = String(texto == null ? '' : texto).trim();
    if (!txt) return '';
    return txt
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map(t => '<p>' + escapeHtml(t).replace(/\n/g, '<br>') + '</p>')
      .join('');
  }

  function limparSlider() {
    if (!track) return;
    track.innerHTML = '';
    track.style.transform = 'translateX(0)';
    if (dotsContainer) dotsContainer.innerHTML = '';
    currentSlide = 0;
    totalSlides = 0;
  }

  function limparVideo() {
    if (!slider) return;
    const videoAnterior = slider.querySelector('.saberes-modal-video');
    if (videoAnterior) videoAnterior.remove();
    if (modalVideoEl) {
      try { modalVideoEl.pause(); } catch (e) {}
      modalVideoEl.removeAttribute('src');
      modalVideoEl.load && modalVideoEl.load();
      modalVideoEl = null;
    }
  }

  function exibirSlider() {
    if (!slider) return;
    slider.style.display = '';
    limparVideo();
  }

  function montarVideo(videoSrc, nomeAlt) {
    limparVideo();
    limparSlider();
    if (!slider || !videoSrc) return;

    if (btnPrev) btnPrev.style.visibility = 'hidden';
    if (btnNext) btnNext.style.visibility = 'hidden';
    if (viewport) viewport.style.display = 'none';
    if (dotsContainer) dotsContainer.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'saberes-modal-video';

    const video = document.createElement('video');
    video.src = videoSrc;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.alt = nomeAlt || '';
    video.setAttribute('aria-label', nomeAlt || 'Vídeo');

    modalVideoEl = video;
    wrap.appendChild(video);
    slider.insertBefore(wrap, slider.firstChild);

    setTimeout(function () {
      try {
        if (modalVideoEl && typeof modalVideoEl.play === 'function') {
          var p = modalVideoEl.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
      } catch (e) {}
    }, 220);
  }

  function atualizarBotoes() {
    if (!btnPrev || !btnNext) return;
    if (totalSlides <= 1) {
      btnPrev.style.visibility = 'hidden';
      btnNext.style.visibility = 'hidden';
      return;
    }
    btnPrev.style.visibility = currentSlide > 0 ? 'visible' : 'hidden';
    btnNext.style.visibility = currentSlide < totalSlides - 1 ? 'visible' : 'hidden';
  }

  function atualizarDots() {
    if (!dotsContainer || totalSlides <= 1) return;
    const dots = dotsContainer.querySelectorAll('.saberes-slider-dot');
    dots.forEach(function (dot, idx) {
      if (idx === currentSlide) {
        dot.classList.add('saberes-slider-dot--ativo');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('saberes-slider-dot--ativo');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  function irParaSlide(idx, animar) {
    if (!track || totalSlides === 0) return;
    const novoIdx = Math.max(0, Math.min(idx, totalSlides - 1));
    currentSlide = novoIdx;
    const offset = -novoIdx * 100;
    if (animar === false) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
    }
    track.style.transform = 'translateX(' + offset + '%)';
    if (animar === false) {
      track.offsetHeight;
      track.style.transition = '';
    }
    atualizarBotoes();
    atualizarDots();
  }

  function montarSlider(imagens, nomeAlt) {
    limparSlider();
    limparVideo();
    if (viewport) viewport.style.display = '';
    if (dotsContainer) dotsContainer.style.display = '';
    if (!track || !imagens || !imagens.length) return;

    const lista = Array.isArray(imagens) ? imagens.slice() : [imagens];
    totalSlides = lista.length;

    lista.forEach(function (src, idx) {
      const slide = document.createElement('div');
      slide.className = 'saberes-slider-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (idx + 1) + ' de ' + totalSlides);

      const imgWrap = document.createElement('div');
      imgWrap.className = 'saberes-slider-imagem-wrap';

      const img = document.createElement('img');
      img.src = src;
      img.alt = totalSlides > 1
        ? (nomeAlt || '') + ' - foto ' + (idx + 1)
        : (nomeAlt || '');
      img.loading = idx === 0 ? 'eager' : 'lazy';
      img.onerror = function () {
        this.style.visibility = 'hidden';
      };
      img.style.visibility = src ? 'visible' : 'hidden';

      imgWrap.appendChild(img);
      slide.appendChild(imgWrap);
      track.appendChild(slide);
    });

    if (dotsContainer && totalSlides > 1) {
      lista.forEach(function (_, idx) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'saberes-slider-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Ir para foto ' + (idx + 1));
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () {
          irParaSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    irParaSlide(0, false);
  }

  function proximoSlide() {
    if (currentSlide < totalSlides - 1) {
      irParaSlide(currentSlide + 1);
    }
  }

  function slideAnterior() {
    if (currentSlide > 0) {
      irParaSlide(currentSlide - 1);
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      slideAnterior();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      proximoSlide();
    });
  }

  function onTouchStart(e) {
    if (totalSlides <= 1) return;
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX;
    if (track) {
      track.style.transition = 'none';
    }
  }

  function onTouchMove(e) {
    if (totalSlides <= 1 || !track) return;
    touchEndX = e.touches[0].clientX;
    const diff = touchEndX - touchStartX;
    const pct = (diff / (viewport ? viewport.offsetWidth : 1)) * 100;
    const baseOffset = -currentSlide * 100;
    track.style.transform = 'translateX(calc(' + baseOffset + '% + ' + pct + '%))';
  }

  function onTouchEnd(e) {
    if (totalSlides <= 1 || !track) return;
    const diff = touchEndX - touchStartX;
    const threshold = (viewport ? viewport.offsetWidth : 300) * 0.18;
    track.style.transition = '';
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        proximoSlide();
      } else {
        slideAnterior();
      }
    } else {
      irParaSlide(currentSlide);
    }
  }

  if (viewport) {
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: true });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  function abrirModal(dados) {
    if (!dados) return;
    ultimoFoco = document.activeElement;

    const tipo = String(dados.tipo || 'imagem').toLowerCase();
    const videoSrc = dados.video || null;

    if (tipo === 'video' && videoSrc) {
      montarVideo(videoSrc, dados.nome);
    } else {
      const imagensStr = dados.imagensStr || '';
      let imagens = [];
      if (imagensStr) {
        imagens = String(imagensStr).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      }
      if (!imagens.length && dados.imagem) {
        imagens = [dados.imagem];
      }
      montarSlider(imagens, dados.nome);
    }

    if (titulo) titulo.textContent = dados.nome || '';
    if (corpo) corpo.innerHTML = quebrarParagrafos(dados.texto);

    body.classList.add('saberes-lock');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('saberes-modal-aberto');
    if (painel) painel.scrollTop = 0;

    setTimeout(function () {
      try { btnFechar && btnFechar.focus(); } catch (e) {}
    }, 60);
  }

  function fecharModal() {
    body.classList.remove('saberes-lock');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('saberes-modal-aberto');
    limparSlider();
    limparVideo();
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') {
      try { ultimoFoco.focus(); } catch (e) {}
    }
    ultimoFoco = null;
  }

  botoesFechar.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      fecharModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    const aberto = modal.classList.contains('saberes-modal-aberto');
    if (!aberto) return;
    if (e.key === 'Escape') {
      fecharModal();
      return;
    }
    if (totalSlides > 1) {
      if (e.key === 'ArrowRight') {
        proximoSlide();
      } else if (e.key === 'ArrowLeft') {
        slideAnterior();
      }
    }
  });

  const itens = document.querySelectorAll('[data-saberes-item]');
  itens.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const dados = {
        id: btn.getAttribute('data-item-id'),
        nome: btn.getAttribute('data-item-nome'),
        imagem: btn.getAttribute('data-item-imagem'),
        imagensStr: btn.getAttribute('data-item-imagens') || '',
        video: btn.getAttribute('data-item-video') || null,
        tipo: btn.getAttribute('data-tipo') || 'imagem',
        texto: btn.getAttribute('data-item-texto')
      };
      abrirModal(dados);
    });
  });
})();
