(function () {
  'use strict';

  var DISPOSITIVO_STORAGE_KEY = 'mqEdu_dispositivoId';
  var PROGRESSO_SALVO_KEY = 'mqEdu_progressoCacaUltimo';
  var TEMPO_POR_NIVEL_MS = 8 * 60 * 1000;
  var GRID_TAMANHO = 17;
  var DIRECOES = [
    { dr:  0, dc:  1, nome: 'H'  },
    { dr:  0, dc: -1, nome: 'Hr' },
    { dr:  1, dc:  0, nome: 'V'  },
    { dr: -1, dc:  0, nome: 'Vr' },
    { dr:  1, dc:  1, nome: 'D'  },
    { dr: -1, dc: -1, nome: 'Dr' },
    { dr:  1, dc: -1, nome: 'Di' },
    { dr: -1, dc:  1, nome: 'Dir' }
  ];
  var ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var tela = document.querySelector('.tela-caca-palavras');
  if (!tela) return;

  var TOTAL_NIVEIS = parseInt(tela.getAttribute('data-total-niveis') || '10', 10);
  var nivelAtualNumero = parseInt(tela.getAttribute('data-nivel-inicial') || '1', 10);

  var elGrid = document.getElementById('cpGrid');
  var elSvgRiscos = document.getElementById('cpSvgRiscos');
  var elNivel = document.getElementById('cpNivelAtual');
  var elTimer = document.getElementById('cpTimerLabel');
  var elMarcador = document.getElementById('cpMarcador');
  var elProgressoFill = document.getElementById('cpProgressoFill');
  var elEncontradas = document.getElementById('cpEncontradas');
  var elTotalPalavras = document.getElementById('cpTotalPalavras');
  var elPalavrasUl = document.getElementById('cpPalavrasUl');
  var btnReiniciar = document.getElementById('cpBotaoReiniciar');
  var btnProximo = document.getElementById('cpBotaoProximo');
  var btnVoltar = document.getElementById('cPvoltar');

  var estado = {
    nivel: nivelAtualNumero,
    palavras: [],
    palavrasNormalizadas: [],
    encontradas: {},
    grid: [],
    palavrasPos: {},
    selecionando: false,
    selecaoInicio: null,
    selecaoFim: null,
    celulasSelecionadas: [],
    timerId: null,
    fimPrevisto: 0,
    nivelTerminado: false,
    progressoJaSalvo: false,
    dispositivoId: null
  };

  function obterDispositivoId() {
    try {
      var existe = localStorage.getItem(DISPOSITIVO_STORAGE_KEY);
      if (existe && /^[a-z0-9_-]{32,120}$/i.test(existe)) return existe;
    } catch (e) {}
    var novo = gerarIdAleatorio(48);
    try { localStorage.setItem(DISPOSITIVO_STORAGE_KEY, novo); } catch (e) {}
    return novo;
  }

  function gerarIdAleatorio(n) {
    var arr = new Uint8Array(n);
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(arr);
      } else {
        for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      }
    } catch (e) {
      for (var j = 0; j < arr.length; j++) arr[j] = Math.floor(Math.random() * 256);
    }
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var out = '';
    for (var k = 0; k < arr.length; k++) out += chars.charAt(arr[k] % chars.length);
    return out;
  }

  function removerAcentos(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
  }

  function formatarRelogio(ms) {
    var totalSeg = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(totalSeg / 60);
    var s = totalSeg % 60;
    return '⏱ ' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function postJson(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      body: JSON.stringify(body || {})
    }).then(function (r) {
      try { return r.json(); } catch (e) { return {}; }
    }).catch(function () { return {}; });
  }

  function registrarDispositivo() {
    var dispId = obterDispositivoId();
    estado.dispositivoId = dispId;
    postJson('/api/jogos/dispositivo', {
      dispositivo_id: dispId,
      user_agent: navigator.userAgent || null
    }).then(function (resp) {
      if (resp && resp.progresso && resp.progresso.nivel_atual && !estado.nivelTerminado) {
        var n = parseInt(resp.progresso.nivel_atual, 10);
        if (!isNaN(n) && n >= 1 && n <= TOTAL_NIVEIS && n !== estado.nivel) {
          carregarNivel(n);
        }
      }
    });
  }

  function salvarProgresso(resultado, forcar) {
    if (!estado.dispositivoId) return Promise.resolve();
    if (estado.progressoJaSalvo && !forcar) return Promise.resolve();
    if (estado.nivelTerminado && resultado !== 'concluido' && !forcar) return Promise.resolve();
    var encontradasLista = [];
    Object.keys(estado.encontradas).forEach(function (p) {
      if (estado.encontradas[p]) encontradasLista.push(p);
    });
    estado.progressoJaSalvo = true;
    return postJson('/api/jogos/caca-palavras/progresso', {
      dispositivo_id: estado.dispositivoId,
      nivel: estado.nivel,
      palavras_encontradas: encontradasLista,
      total_palavras: estado.palavras.length,
      resultado: resultado || 'abandonado'
    });
  }

  function buscarNivelApi(numero) {
    return fetch('/api/jogos/caca-palavras/nivel/' + encodeURIComponent(String(numero)), {
      credentials: 'same-origin'
    }).then(function (r) {
      if (!r.ok) throw new Error('não ok');
      return r.json();
    });
  }

  function carregarNivel(numero) {
    estado.nivel = numero;
    estado.nivelTerminado = false;
    estado.progressoJaSalvo = false;
    estado.encontradas = {};
    estado.palavrasPos = {};
    pararTimer();
    atualizarInfoNivel();
    buscarNivelApi(numero).then(function (resp) {
      var palavrasBruto;
      if (resp && resp.sucesso && resp.nivel && resp.nivel.palavras) {
        palavrasBruto = resp.nivel.palavras.map(function (p) { return p.palavra; });
      } else {
        palavrasBruto = extrairPalavrasDataAttr();
      }
      montarNivelComPalavras(palavrasBruto);
      iniciarTimer();
    }).catch(function () {
      var palavrasFallback = extrairPalavrasDataAttr();
      montarNivelComPalavras(palavrasFallback);
      iniciarTimer();
    });
  }

  function extrairPalavrasDataAttr() {
    var attr = tela.getAttribute('data-nivel-palavras') || '';
    if (!attr) return [];
    return attr.split(',').map(function (s) { return (s || '').trim(); }).filter(Boolean);
  }

  function atualizarInfoNivel() {
    if (elNivel) elNivel.textContent = String(estado.nivel);
    if (btnProximo) btnProximo.disabled = true;
  }

  function montarNivelComPalavras(lista) {
    estado.palavras = lista.filter(Boolean);
    estado.palavrasNormalizadas = estado.palavras.map(function (p) { return removerAcentos(p); });
    estado.encontradas = {};
    estado.palavras.forEach(function (p) { estado.encontradas[p] = false; });

    renderizarListaPalavras();
    gerarGrid();
    renderizarGrid();
    limparRiscos();
    atualizarProgressoUI();
    definirMensagem('Encontre as 10 palavras no grid. Arraste sobre as letras.');
  }

  function renderizarListaPalavras() {
    if (!elPalavrasUl) return;
    elPalavrasUl.innerHTML = '';
    estado.palavras.forEach(function (p) {
      var li = document.createElement('li');
      li.className = 'cp-palavra-item';
      li.setAttribute('data-palavra', p);
      var spanCheck = document.createElement('span');
      spanCheck.className = 'cp-palavra-check';
      var spanTexto = document.createElement('span');
      spanTexto.className = 'cp-palavra-texto';
      spanTexto.textContent = p;
      li.appendChild(spanCheck);
      li.appendChild(spanTexto);
      elPalavrasUl.appendChild(li);
    });
    if (elTotalPalavras) elTotalPalavras.textContent = String(estado.palavras.length);
    if (elEncontradas) elEncontradas.textContent = '0';
  }

  function celulaLivre(r, c, tamanho, dr, dc, palavra) {
    for (var i = 0; i < palavra.length; i++) {
      var rr = r + dr * i;
      var cc = c + dc * i;
      if (rr < 0 || cc < 0 || rr >= tamanho || cc >= tamanho) return false;
      var atual = estado.grid[rr][cc];
      if (atual !== '' && atual !== palavra.charAt(i)) return false;
    }
    return true;
  }

  function tentarInserirPalavra(palavra, tentativas) {
    var p = removerAcentos(palavra);
    if (!p) return false;
    var T = GRID_TAMANHO;
    for (var t = 0; t < (tentativas || 300); t++) {
      var dir = DIRECOES[Math.floor(Math.random() * DIRECOES.length)];
      var rIni = Math.floor(Math.random() * T);
      var cIni = Math.floor(Math.random() * T);
      if (celulaLivre(rIni, cIni, T, dir.dr, dir.dc, p)) {
        for (var i = 0; i < p.length; i++) {
          var rr = rIni + dir.dr * i;
          var cc = cIni + dir.dc * i;
          estado.grid[rr][cc] = p.charAt(i);
        }
        estado.palavrasPos[palavra] = {
          palavra: palavra,
          normalizada: p,
          direcao: dir.nome,
          inicio: { r: rIni, c: cIni },
          fim: { r: rIni + dir.dr * (p.length - 1), c: cIni + dir.dc * (p.length - 1) }
        };
        return true;
      }
    }
    return false;
  }

  function gerarGrid() {
    var T = GRID_TAMANHO;
    estado.grid = [];
    for (var r = 0; r < T; r++) {
      var linha = [];
      for (var c = 0; c < T; c++) linha.push('');
      estado.grid.push(linha);
    }
    var palavrasPorTamanho = estado.palavras.slice().sort(function (a, b) {
      return removerAcentos(b).length - removerAcentos(a).length;
    });
    palavrasPorTamanho.forEach(function (p) {
      tentarInserirPalavra(p, 500);
    });
    for (var r2 = 0; r2 < T; r2++) {
      for (var c2 = 0; c2 < T; c2++) {
        if (estado.grid[r2][c2] === '') {
          estado.grid[r2][c2] = ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length));
        }
      }
    }
  }

  function renderizarGrid() {
    if (!elGrid) return;
    var T = GRID_TAMANHO;
    elGrid.innerHTML = '';
    elGrid.style.gridTemplateColumns = 'repeat(' + T + ', 1fr)';
    elGrid.style.gridTemplateRows = 'repeat(' + T + ', 1fr)';
    for (var r = 0; r < T; r++) {
      for (var c = 0; c < T; c++) {
        var cel = document.createElement('button');
        cel.type = 'button';
        cel.className = 'cp-celula';
        cel.setAttribute('role', 'gridcell');
        cel.setAttribute('aria-label', 'Letra ' + estado.grid[r][c]);
        cel.setAttribute('data-r', String(r));
        cel.setAttribute('data-c', String(c));
        cel.textContent = estado.grid[r][c];
        elGrid.appendChild(cel);
      }
    }
  }

  function pegarCelulaNoPonto(clientX, clientY) {
    var el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    if (!el.classList || !el.classList.contains('cp-celula')) return null;
    var r = parseInt(el.getAttribute('data-r'), 10);
    var c = parseInt(el.getAttribute('data-c'), 10);
    if (isNaN(r) || isNaN(c)) return null;
    return { el: el, r: r, c: c };
  }

  function getCelulasEntre(a, b) {
    if (!a || !b) return [];
    var dr = b.r - a.r;
    var dc = b.c - a.c;
    if (a.r === b.r && a.c === b.c) return [a];
    var passos = Math.max(Math.abs(dr), Math.abs(dc));
    var passoR = dr === 0 ? 0 : dr / passos;
    var passoC = dc === 0 ? 0 : dc / passos;
    var res = [];
    for (var i = 0; i <= passos; i++) {
      var rr = a.r + Math.round(passoR * i);
      var cc = a.c + Math.round(passoC * i);
      res.push({ r: rr, c: cc });
    }
    return res;
  }

  function obterStringCelulas(cels) {
    var str = '';
    for (var i = 0; i < cels.length; i++) {
      var cc = cels[i];
      if (estado.grid[cc.r] && estado.grid[cc.r][cc.c]) str += estado.grid[cc.r][cc.c];
    }
    return str;
  }

  function destacarCelulas(cels, classe) {
    var T = GRID_TAMANHO;
    var filhos = elGrid ? elGrid.children : [];
    for (var i = 0; i < cels.length; i++) {
      var cc = cels[i];
      if (cc.r < 0 || cc.c < 0 || cc.r >= T || cc.c >= T) continue;
      var idx = cc.r * T + cc.c;
      if (filhos[idx]) filhos[idx].classList.add(classe);
    }
  }

  function limparSelecaoTemp() {
    var filhos = elGrid ? elGrid.children : [];
    for (var i = 0; i < filhos.length; i++) {
      filhos[i].classList.remove('cp-celula--selecao');
    }
  }

  function verificarSelecao(cels) {
    if (!cels || cels.length < 2) return null;
    var normal = obterStringCelulas(cels);
    var reversa = normal.split('').reverse().join('');
    for (var i = 0; i < estado.palavrasNormalizadas.length; i++) {
      var p = estado.palavrasNormalizadas[i];
      if (!p) continue;
      if (normal === p || reversa === p) {
        return estado.palavras[i];
      }
    }
    return null;
  }

  function riscoCorPara(palavra) {
    var cores = [
      '#7FA23E', '#B66524', '#E8843C', '#89B03F',
      '#C9833B', '#9C5A22', '#E8B02A', '#5A7A2E',
      '#3B2410', '#6B4520'
    ];
    var h = 0;
    for (var i = 0; i < palavra.length; i++) h = (h * 31 + palavra.charCodeAt(i)) >>> 0;
    return cores[h % cores.length];
  }

  function desenharRisco(palavra, info) {
    if (!elSvgRiscos) return;
    var T = GRID_TAMANHO;
    var cellW = 100 / T;
    var cellH = 100 / T;
    var x1 = info.inicio.c * cellW + cellW / 2;
    var y1 = info.inicio.r * cellH + cellH / 2;
    var x2 = info.fim.c * cellW + cellW / 2;
    var y2 = info.fim.r * cellH + cellH / 2;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toFixed(3));
    line.setAttribute('y1', y1.toFixed(3));
    line.setAttribute('x2', x2.toFixed(3));
    line.setAttribute('y2', y2.toFixed(3));
    line.setAttribute('stroke', riscoCorPara(palavra));
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', '0.85');
    line.setAttribute('data-palavra', palavra);
    elSvgRiscos.appendChild(line);

    var marcador = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marcador.setAttribute('cx', x1.toFixed(3));
    marcador.setAttribute('cy', y1.toFixed(3));
    marcador.setAttribute('r', '0.9');
    marcador.setAttribute('fill', riscoCorPara(palavra));
    marcador.setAttribute('data-palavra', palavra);
    elSvgRiscos.appendChild(marcador);

    var li = elPalavrasUl ? elPalavrasUl.querySelector('[data-palavra="' + CSS.escape(palavra) + '"]') : null;
    if (li) li.classList.add('cp-palavra-item--encontrada');
    var T2 = GRID_TAMANHO;
    var cels = [];
    var inicio = info.inicio;
    var fim = info.fim;
    var passos = Math.max(Math.abs(fim.r - inicio.r), Math.abs(fim.c - inicio.c));
    var passoR = passos === 0 ? 0 : (fim.r - inicio.r) / passos;
    var passoC = passos === 0 ? 0 : (fim.c - inicio.c) / passos;
    for (var ii = 0; ii <= passos; ii++) {
      cels.push({ r: inicio.r + Math.round(passoR * ii), c: inicio.c + Math.round(passoC * ii) });
    }
    var filhos = elGrid ? elGrid.children : [];
    for (var j = 0; j < cels.length; j++) {
      var cc = cels[j];
      if (cc.r < 0 || cc.c < 0 || cc.r >= T2 || cc.c >= T2) continue;
      var idx = cc.r * T2 + cc.c;
      if (filhos[idx]) filhos[idx].classList.add('cp-celula--marcada');
    }
  }

  function limparRiscos() {
    if (!elSvgRiscos) return;
    while (elSvgRiscos.firstChild) elSvgRiscos.removeChild(elSvgRiscos.firstChild);
  }

  function atualizarProgressoUI() {
    var total = estado.palavras.length || 1;
    var qtd = 0;
    Object.keys(estado.encontradas).forEach(function (p) { if (estado.encontradas[p]) qtd++; });
    var pct = Math.round((qtd / total) * 100);
    if (elProgressoFill) elProgressoFill.style.width = pct + '%';
    if (elEncontradas) elEncontradas.textContent = String(qtd);
    if (qtd >= estado.palavras.length && !estado.nivelTerminado) {
      concluirNivel();
    }
  }

  function definirMensagem(msg) {
    if (!elMarcador) return;
    elMarcador.textContent = msg || '';
  }

  function concluirNivel() {
    estado.nivelTerminado = true;
    pararTimer();
    var ultimo = estado.nivel >= TOTAL_NIVEIS;
    if (btnProximo) btnProximo.disabled = ultimo;
    salvarProgresso('concluido', true);
    if (ultimo) {
      definirMensagem('🎉 Parabéns! Você concluiu todos os 10 níveis do caça-palavras.');
    } else {
      definirMensagem('✅ Nível ' + estado.nivel + ' concluído! Toque em Próximo nível.');
    }
  }

  function tempoEsgotado() {
    if (estado.nivelTerminado) return;
    estado.nivelTerminado = true;
    pararTimer();
    salvarProgresso('tempo_esgotado', true);
    definirMensagem('⏰ Tempo esgotado. Tente novamente ou reinicie o nível.');
  }

  function iniciarTimer() {
    pararTimer();
    estado.fimPrevisto = Date.now() + TEMPO_POR_NIVEL_MS;
    if (elTimer) elTimer.textContent = formatarRelogio(TEMPO_POR_NIVEL_MS);
    estado.timerId = setInterval(function () {
      var restante = estado.fimPrevisto - Date.now();
      if (restante <= 0) {
        if (elTimer) elTimer.textContent = formatarRelogio(0);
        tempoEsgotado();
      } else {
        if (elTimer) elTimer.textContent = formatarRelogio(restante);
      }
    }, 250);
  }

  function pararTimer() {
    if (estado.timerId) {
      clearInterval(estado.timerId);
      estado.timerId = null;
    }
  }

  function onPointerDown(e) {
    if (estado.nivelTerminado) return;
    var ponto = extrairPonto(e);
    if (!ponto) return;
    var cel = pegarCelulaNoPonto(ponto.x, ponto.y);
    if (!cel) return;
    estado.selecionando = true;
    estado.progressoJaSalvo = false;
    estado.selecaoInicio = { r: cel.r, c: cel.c };
    estado.selecaoFim = { r: cel.r, c: cel.c };
    estado.celulasSelecionadas = [{ r: cel.r, c: cel.c }];
    limparSelecaoTemp();
    destacarCelulas(estado.celulasSelecionadas, 'cp-celula--selecao');
    if (e.cancelable && e.type !== 'mousedown') e.preventDefault();
  }

  function onPointerMove(e) {
    if (!estado.selecionando) return;
    var ponto = extrairPonto(e);
    if (!ponto) return;
    var cel = pegarCelulaNoPonto(ponto.x, ponto.y);
    if (!cel) return;
    limparSelecaoTemp();
    var fim = { r: cel.r, c: cel.c };
    var cels = getCelulasEntre(estado.selecaoInicio, fim);
    estado.selecaoFim = fim;
    estado.celulasSelecionadas = cels;
    destacarCelulas(cels, 'cp-celula--selecao');
    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp() {
    if (!estado.selecionando) return;
    estado.selecionando = false;
    var cels = estado.celulasSelecionadas || [];
    limparSelecaoTemp();
    if (!cels.length) return;
    var encontrada = verificarSelecao(cels);
    if (encontrada && !estado.encontradas[encontrada]) {
      estado.encontradas[encontrada] = true;
      var info = estado.palavrasPos[encontrada];
      if (info) {
        desenharRisco(encontrada, info);
      } else {
        var norm = estado.palavrasNormalizadas[estado.palavras.indexOf(encontrada)];
        var strAtual = obterStringCelulas(cels);
        var rev = strAtual.split('').reverse().join('');
        if (strAtual !== norm && rev === norm) cels = cels.slice().reverse();
        if (cels.length >= 2) {
          desenharRisco(encontrada, {
            palavra: encontrada,
            normalizada: norm,
            direcao: 'custom',
            inicio: { r: cels[0].r, c: cels[0].c },
            fim: { r: cels[cels.length - 1].r, c: cels[cels.length - 1].c }
          });
        }
      }
      definirMensagem('Encontrou: ' + encontrada);
      atualizarProgressoUI();
    } else if (encontrada && estado.encontradas[encontrada]) {
      definirMensagem('"' + encontrada + '" já foi encontrada.');
    } else if (cels.length >= 2) {
      definirMensagem('Palavra não encontrada. Tente novamente.');
    }
    estado.celulasSelecionadas = [];
    estado.selecaoInicio = null;
    estado.selecaoFim = null;
  }

  function extrairPonto(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    if (typeof e.clientX === 'number') return { x: e.clientX, y: e.clientY };
    return null;
  }

  function bindSelecao() {
    if (!elGrid) return;
    elGrid.addEventListener('mousedown', onPointerDown);
    elGrid.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp, { passive: true });
    document.addEventListener('touchcancel', onPointerUp, { passive: true });
  }

  function bindBotoes() {
    if (btnReiniciar) {
      btnReiniciar.addEventListener('click', function () {
        if (!estado.nivelTerminado && estado.dispositivoId && estado.palavras.length > 0) {
          salvarProgresso('abandonado', true).catch(function () {});
        }
        setTimeout(function () { carregarNivel(estado.nivel); }, 30);
      });
    }
    if (btnProximo) {
      btnProximo.addEventListener('click', function () {
        var prox = estado.nivel + 1;
        if (prox > TOTAL_NIVEIS) return;
        carregarNivel(prox);
      });
    }
    if (btnVoltar) {
      btnVoltar.addEventListener('click', function (e) {
        if (!estado.nivelTerminado && estado.dispositivoId && estado.palavras.length > 0) {
          salvarProgresso('abandonado', true).catch(function () {});
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (!estado.nivelTerminado && estado.dispositivoId && estado.palavras.length > 0) {
        try { salvarProgresso('abandonado', true); } catch (err) {}
      }
    });
    window.addEventListener('pagehide', function () {
      if (!estado.nivelTerminado && estado.dispositivoId && estado.palavras.length > 0) {
        try { salvarProgresso('abandonado', true); } catch (err) {}
      }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && !estado.nivelTerminado && estado.dispositivoId) {
        try { salvarProgresso('abandonado', false); } catch (err) {}
      }
    });
  }

  function inicializar() {
    registrarDispositivo();
    bindSelecao();
    bindBotoes();
    carregarNivel(estado.nivel);
  }

  inicializar();
})();
