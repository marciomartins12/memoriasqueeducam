(function () {
  'use strict';

  var carrossel = document.getElementById('moradoresCarrossel');
  if (!carrossel) return;

  var trilho = document.getElementById('moradoresTrilho');
  var dotsWrapper = document.getElementById('moradoresDots');
  if (!trilho || !dotsWrapper) return;

  var slides = carrossel.querySelectorAll('.morador-slide');
  var dots = dotsWrapper.querySelectorAll('.morador-dot');
  var TOTAL = slides.length;
  var ATUAL = 0;
  var LARGURA_VIEWPORT = 1;

  var startX = 0;
  var startY = 0;
  var deltaX = 0;
  var deltaY = 0;
  var touchStartHora = 0;
  var isTouching = false;
  var isHorizontal = null;
  var relatoScrollEl = null;

  function getScrollContainer(el) {
    while (el && el !== carrossel) {
      if (el.classList && (el.classList.contains('morador-relato') || el.classList.contains('morador-relato-scroll'))) {
        var s = window.getComputedStyle(el).overflowY;
        if (s === 'auto' || s === 'scroll') return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function atualizarTrilho(deslize) {
    if (typeof deslize !== 'number') deslize = 0;
    var x = -1 * ATUAL * 100;
    if (deslize !== 0) {
      var porcent = (deslize / carrossel.offsetWidth) * 100;
      x += porcent;
    }
    trilho.style.transform = 'translate3d(' + x + '%, 0, 0)';
  }

  function atualizarDots() {
    dots.forEach(function (d, i) {
      if (i === ATUAL) {
        d.classList.add('morador-dot-ativo');
        d.setAttribute('aria-selected', 'true');
      } else {
        d.classList.remove('morador-dot-ativo');
        d.setAttribute('aria-selected', 'false');
      }
    });
  }

  function irParaSlide(idx, animar) {
    if (TOTAL === 0) return;
    if (idx < 0) idx = 0;
    if (idx > TOTAL - 1) idx = TOTAL - 1;
    ATUAL = idx;
    if (animar === false) {
      trilho.style.transition = 'none';
    } else {
      trilho.style.transition = '';
    }
    atualizarTrilho(0);
    atualizarDots();
    if (animar === false) {
      void trilho.offsetWidth;
      trilho.style.transition = '';
    }
    var slideAtivo = slides[ATUAL];
    if (slideAtivo && typeof slideAtivo.setAttribute === 'function') {
      slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
      slideAtivo.setAttribute('aria-hidden', 'false');
    }
  }

  function proximo() { irParaSlide(ATUAL + 1, true); }
  function anterior() { irParaSlide(ATUAL - 1, true); }

  // ---------- Touch events ----------

  function onTouchStart(e) {
    var t = e.touches && e.touches[0];
    if (!t) return;
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    touchStartHora = Date.now();
    isTouching = true;
    isHorizontal = null;
    relatoScrollEl = getScrollContainer(e.target);
    trilho.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!isTouching) return;
    var t = e.touches && e.touches[0];
    if (!t) return;
    deltaX = t.clientX - startX;
    deltaY = t.clientY - startY;

    if (isHorizontal === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        if (isHorizontal) {
          trilho.style.transition = 'none';
        }
      }
    }

    if (!isHorizontal) return;

    var bloquear = false;
    if (relatoScrollEl && deltaY < 0) {
      var top = relatoScrollEl.scrollTop;
      if (top < relatoScrollEl.scrollHeight - relatoScrollEl.clientHeight - 1) {
        bloquear = true;
      }
    }
    if (relatoScrollEl && deltaY > 0) {
      var t2 = relatoScrollEl.scrollTop;
      if (t2 > 1) bloquear = true;
    }
    if (bloquear) {
      isHorizontal = false;
      return;
    }

    if (e.cancelable) e.preventDefault();
    atualizarTrilho(deltaX);
  }

  function onTouchEnd() {
    if (!isTouching) return;
    isTouching = false;
    trilho.style.transition = '';

    var duracao = Date.now() - touchStartHora;
    var limiarDist = carrossel.offsetWidth * 0.2;
    var limiarRapido = 52;
    var distancia = Math.abs(deltaX);

    if (isHorizontal && (distancia >= limiarDist || (distancia >= limiarRapido && duracao <= 280))) {
      if (deltaX < 0) {
        proximo();
      } else {
        anterior();
      }
    } else {
      irParaSlide(ATUAL, true);
    }

    relatoScrollEl = null;
  }

  carrossel.addEventListener('touchstart', onTouchStart, { passive: true });
  carrossel.addEventListener('touchmove', onTouchMove, { passive: false });
  carrossel.addEventListener('touchend', onTouchEnd, { passive: true });
  carrossel.addEventListener('touchcancel', onTouchEnd, { passive: true });

  // ---------- Pointer events (desktop) ----------

  var isPointerDown = false;

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === 'touch') return;
    startX = e.clientX;
    deltaX = 0;
    touchStartHora = Date.now();
    isPointerDown = true;
    trilho.style.transition = 'none';
    try { carrossel.setPointerCapture(e.pointerId); } catch (_) {}
  }
  function onPointerMove(e) {
    if (!isPointerDown) return;
    deltaX = e.clientX - startX;
    atualizarTrilho(deltaX);
  }
  function onPointerUp() {
    if (!isPointerDown) return;
    isPointerDown = false;
    trilho.style.transition = '';
    var dur = Date.now() - touchStartHora;
    var ld = carrossel.offsetWidth * 0.2;
    var d = Math.abs(deltaX);
    if (d >= ld || (d >= 60 && dur <= 320)) {
      if (deltaX < 0) proximo(); else anterior();
    } else {
      irParaSlide(ATUAL, true);
    }
  }

  carrossel.addEventListener('pointerdown', onPointerDown);
  carrossel.addEventListener('pointermove', onPointerMove);
  carrossel.addEventListener('pointerup', onPointerUp);
  carrossel.addEventListener('pointercancel', onPointerUp);
  carrossel.addEventListener('pointerleave', onPointerUp);

  // ---------- Clique nos dots ----------

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-dot'), 10);
      if (!isNaN(idx)) irParaSlide(idx, true);
    });
  });

  // ---------- Mouse wheel lateral ----------

  var wheelAccum = 0;
  var wheelTimer = null;
  carrossel.addEventListener('wheel', function (e) {
    var h = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (h === 0) return;
    if (e.cancelable) e.preventDefault();
    wheelAccum += h;
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () {
      if (Math.abs(wheelAccum) > 40) {
        if (wheelAccum > 0) proximo(); else anterior();
      }
      wheelAccum = 0;
    }, 120);
  }, { passive: false });

  // ---------- Resize ----------

  function onResize() {
    atualizarTrilho(0);
  }
  window.addEventListener('resize', onResize);

  // ---------- Keyboard ----------

  document.addEventListener('keydown', function (e) {
    if (carrossel.offsetParent === null) return;
    if (e.key === 'ArrowLeft') { anterior(); }
    else if (e.key === 'ArrowRight') { proximo(); }
  });

  // ---------- Boot ----------

  irParaSlide(0, false);
})();
