(function () {
  'use strict';

  const STORAGE_DISP_ID = 'mqEdu_dispositivoId';

  const tela = document.querySelector('.tela-verdadeiro-falso');
  const btnVoltar = document.getElementById('vfVoltar');
  const elNivelInfo = document.getElementById('vfNivelInfo');
  const elTimer = document.getElementById('vfTimer');
  const elProgressoBar = document.getElementById('vfProgressoBar');
  const elProgressoTexto = document.getElementById('vfProgressoTexto');
  const elMarcador = document.getElementById('vfMarcador');
  let elQuestoesWrap = document.getElementById('vfQuestoes');
  const btnReiniciar = document.getElementById('vfBotaoReiniciar');
  const btnProximo = document.getElementById('vfBotaoProximo');

  if (!tela) return;

  const TOTAL_NIVEIS = parseInt(tela.getAttribute('data-total-niveis') || '1', 10) || 1;
  const NIVEL_INICIAL = parseInt(tela.getAttribute('data-nivel-inicial') || '1', 10) || 1;
  const NIVEL_PERGUNTAS_FALLBACK = (tela.getAttribute('data-nivel-perguntas') || '').trim();

  let dispositivoId = obterDispositivoId();
  let nivelAtual = NIVEL_INICIAL;
  let questoesAtuais = [];
  let respostasAtuais = new Map();
  let timerHandle = null;
  let segundosRestantes = 0;
  let nivelFinalizado = false;
  let progressoJaSalvo = false;

  function obterDispositivoId() {
    let id = '';
    try {
      id = localStorage.getItem(STORAGE_DISP_ID) || '';
    } catch (e) {}
    if (id && id.length >= 10) return id;
    id = gerarId(48);
    try { localStorage.setItem(STORAGE_DISP_ID, id); } catch (e) {}
    return id;
  }

  function gerarId(tamanho) {
    const chars = 'abcdef0123456789';
    const arr = new Uint8Array(tamanho || 32);
    try {
      (window.crypto || window.msCrypto || {}).getRandomValues(arr);
    } catch (e) {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    let s = '';
    for (let i = 0; i < arr.length; i++) s += chars[arr[i] % chars.length];
    return s;
  }

  function registrarDispositivo() {
    const payload = {
      dispositivo_id: dispositivoId,
      user_agent: (navigator && navigator.userAgent) ? String(navigator.userAgent).slice(0, 5000) : null
    };
    fetch('/api/jogos/dispositivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(resp => {
      if (resp && resp.sucesso && resp.progressos && resp.progressos.verdadeiroFalso && resp.progressos.verdadeiroFalso.nivel_atual) {
        const n = parseInt(resp.progressos.verdadeiroFalso.nivel_atual, 10);
        if (!isNaN(n) && n >= 1 && n <= TOTAL_NIVEIS) {
          nivelAtual = n;
        }
      }
      carregarNivel(nivelAtual, true);
    }).catch(() => {
      carregarNivel(nivelAtual, true);
    });
  }

  function carregarNivel(numero, usarNivelForcado) {
    const n = (usarNivelForcado === true) ? (parseInt(numero, 10) || nivelAtual) : (parseInt(numero, 10) || nivelAtual);
    if (n < 1 || n > TOTAL_NIVEIS) return;
    nivelAtual = n;
    respostasAtuais = new Map();
    nivelFinalizado = false;
    progressoJaSalvo = false;
    if (btnProximo) {
      btnProximo.disabled = true;
      btnProximo.textContent = (nivelAtual >= TOTAL_NIVEIS) ? 'Última pergunta' : 'Próxima pergunta';
    }
    atualizarInfoNivel();

    fetch('/api/jogos/verdadeiro-ou-falso/nivel/' + n, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(resp => {
      if (resp && resp.sucesso && resp.nivel && Array.isArray(resp.nivel.questoes) && resp.nivel.questoes.length) {
        montarNivelComQuestoes(resp.nivel);
      } else {
        montarNivelComFallback();
      }
    }).catch(() => {
      montarNivelComFallback();
    });
  }

  function montarNivelComFallback() {
    const nivel = { numero: nivelAtual, tempo_segundos: 300, questoes: [] };
    if (NIVEL_PERGUNTAS_FALLBACK) {
      const partes = NIVEL_PERGUNTAS_FALLBACK.split('|').filter(function (p) { return p.trim(); });
      partes.forEach(function (parte, idx) {
        const pedacos = parte.split(':');
        if (pedacos.length < 3) return;
        const id = parseInt(pedacos[0], 10) || idx + 1;
        const gabStr = pedacos[pedacos.length - 1];
        const pergunta = pedacos.slice(1, -1).join(':').trim();
        if (!pergunta) return;
        nivel.questoes.push({
          id: id,
          pergunta: pergunta,
          gabarito: gabStr === '1'
        });
      });
    }
    if (!nivel.questoes.length) {
      nivel.questoes = [
        { id: 1, pergunta: 'Sem dados do nível. Recarregue a página.', gabarito: true }
      ];
    }
    montarNivelComQuestoes(nivel);
  }

  function montarNivelComQuestoes(nivel) {
    questoesAtuais = nivel.questoes.slice();
    const tempoSeg = parseInt(nivel.tempo_segundos, 10) || 300;
    const lista = document.createElement('ul');
    lista.className = 'vf-questoes';
    lista.id = 'vfQuestoes';

    questoesAtuais.forEach(function (quest) {
      const li = document.createElement('li');
      li.className = 'vf-questao vf-questao--unica';
      li.setAttribute('data-questao-id', String(quest.id));
      li.setAttribute('data-gabarito', quest.gabarito ? '1' : '0');
      li.setAttribute('role', 'group');
      li.setAttribute('aria-labelledby', 'vf-pergunta-' + quest.id);

      const header = document.createElement('div');
      header.className = 'vf-pergunta-cabecalho';
      const numeroEl = document.createElement('span');
      numeroEl.className = 'vf-pergunta-numero';
      numeroEl.textContent = 'Pergunta ' + nivelAtual;
      header.appendChild(numeroEl);

      const p = document.createElement('p');
      p.className = 'vf-pergunta vf-pergunta--grande';
      p.id = 'vf-pergunta-' + quest.id;
      p.textContent = quest.pergunta;

      const opcoes = document.createElement('div');
      opcoes.className = 'vf-opcoes vf-opcoes--grandes';

      const btnV = document.createElement('button');
      btnV.type = 'button';
      btnV.className = 'vf-opcao vf-opcao--verdadeiro';
      btnV.setAttribute('data-resposta', '1');
      btnV.setAttribute('aria-label', 'Verdadeiro');
      btnV.innerHTML = '<svg viewBox="0 0 24 24" class="vf-opcao-icone" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Verdadeiro</span>';

      const btnF = document.createElement('button');
      btnF.type = 'button';
      btnF.className = 'vf-opcao vf-opcao--falso';
      btnF.setAttribute('data-resposta', '0');
      btnF.setAttribute('aria-label', 'Falso');
      btnF.innerHTML = '<svg viewBox="0 0 24 24" class="vf-opcao-icone" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span>Falso</span>';

      btnV.addEventListener('click', function () { responderQuestao(quest.id, true, li); });
      btnF.addEventListener('click', function () { responderQuestao(quest.id, false, li); });

      opcoes.appendChild(btnV);
      opcoes.appendChild(btnF);

      const fb = document.createElement('div');
      fb.className = 'vf-questao-feedback';
      fb.setAttribute('role', 'status');
      fb.setAttribute('aria-live', 'polite');

      li.appendChild(header);
      li.appendChild(p);
      li.appendChild(opcoes);
      li.appendChild(fb);
      lista.appendChild(li);
    });

    if (elQuestoesWrap && elQuestoesWrap.parentNode) {
      elQuestoesWrap.parentNode.replaceChild(lista, elQuestoesWrap);
    }
    elQuestoesWrap = lista;

    atualizarProgresso();
    iniciarTimer(tempoSeg);
    window.scrollTo && window.scrollTo(0, 0);
  }

  function responderQuestao(questaoId, resposta, li) {
    if (nivelFinalizado) return;
    const gabStr = li.getAttribute('data-gabarito');
    const gabarito = gabStr === '1';
    respostasAtuais.set(questaoId, {
      questao_id: questaoId,
      resposta: resposta,
      gabarito: gabarito
    });

    const opcoes = li.querySelectorAll('.vf-opcao');
    opcoes.forEach(function (btn) {
      btn.classList.remove('vf-opcao--selecionado');
      btn.disabled = true;
    });
    const selecionado = resposta ? li.querySelector('.vf-opcao--verdadeiro') : li.querySelector('.vf-opcao--falso');
    if (selecionado) selecionado.classList.add('vf-opcao--selecionado');

    const acertou = resposta === gabarito;
    const feedback = li.querySelector('.vf-questao-feedback');
    if (feedback) {
      feedback.textContent = acertou ? 'Acertou!' : 'Ops, resposta incorreta.';
      li.classList.add(acertou ? 'vf-questao--acerto' : 'vf-questao--erro');
      feedback.classList.add(acertou ? 'vf-feedback--acerto' : 'vf-feedback--erro');
    }

    atualizarProgresso();

    if (respostasAtuais.size >= questoesAtuais.length) {
      concluirNivel();
    }
  }

  function atualizarProgresso() {
    const total = TOTAL_NIVEIS;
    const pct = total ? (100 * ((nivelAtual - 1 + respostasAtuais.size) / total)) : 0;
    if (elProgressoBar) elProgressoBar.style.width = Math.max(0, Math.min(100, pct)).toFixed(1) + '%';
    if (elProgressoTexto) elProgressoTexto.textContent = 'Nível ' + nivelAtual + ' / ' + TOTAL_NIVEIS;
  }

  function atualizarInfoNivel() {
    if (elNivelInfo) elNivelInfo.textContent = 'Nível ' + nivelAtual + ' / ' + TOTAL_NIVEIS;
    atualizarProgresso();
  }

  function formatarTempo(segundos) {
    const s = Math.max(0, parseInt(segundos, 10) || 0);
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return (m < 10 ? '0' + m : '' + m) + ':' + (seg < 10 ? '0' + seg : '' + seg);
  }

  function iniciarTimer(segundos) {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    segundosRestantes = segundos;
    atualizarTimerUI();
    timerHandle = setInterval(function () {
      segundosRestantes = Math.max(0, segundosRestantes - 1);
      atualizarTimerUI();
      if (segundosRestantes <= 0) {
        if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
        tempoEsgotado();
      }
    }, 1000);
  }

  function atualizarTimerUI() {
    if (!elTimer) return;
    elTimer.textContent = '⏱ ' + formatarTempo(segundosRestantes);
    if (segundosRestantes <= 30) {
      elTimer.classList.add('cp-timer-label--urgente');
    } else {
      elTimer.classList.remove('cp-timer-label--urgente');
    }
  }

  function coletarRespostasParaSalvar() {
    const arr = [];
    questoesAtuais.forEach(function (quest) {
      const r = respostasAtuais.get(quest.id);
      if (r) {
        arr.push({
          id: quest.id,
          resposta: r.resposta,
          gabarito: r.gabarito
        });
      } else {
        arr.push({
          id: quest.id,
          resposta: null,
          gabarito: quest.gabarito
        });
      }
    });
    return arr;
  }

  function salvarProgresso(resultado, forcar) {
    if (progressoJaSalvo && !forcar) return Promise.resolve();
    progressoJaSalvo = true;
    const arr = coletarRespostasParaSalvar();
    const body = {
      dispositivo_id: dispositivoId,
      nivel: nivelAtual,
      total_questoes: questoesAtuais.length,
      respostas: arr,
      resultado: resultado
    };
    const isKeepAlive = forcar === true;
    try {
      const prom = fetch('/api/jogos/verdadeiro-ou-falso/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        keepalive: isKeepAlive,
        body: JSON.stringify(body)
      });
      if (isKeepAlive) return Promise.resolve();
      return prom.catch(function () {});
    } catch (e) {
      return Promise.resolve();
    }
  }

  function concluirNivel() {
    if (nivelFinalizado) return;
    nivelFinalizado = true;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    const todasMarcadas = questoesAtuais.every(function (q) { return respostasAtuais.has(q.id); });
    const resultado = todasMarcadas ? 'concluido' : 'abandonado';

    salvarProgresso(resultado, false).then(function () {
      if (btnProximo) {
        if (nivelAtual >= TOTAL_NIVEIS) {
          btnProximo.textContent = 'Você chegou ao fim!';
          btnProximo.disabled = true;
        } else {
          btnProximo.disabled = false;
          btnProximo.textContent = 'Próxima pergunta';
        }
      }
      if (elMarcador) {
        elMarcador.classList.add('cp-marcador--sucesso');
      }
    });
  }

  function tempoEsgotado() {
    if (nivelFinalizado) return;
    nivelFinalizado = true;
    if (btnProximo) btnProximo.disabled = true;
    if (elMarcador) elMarcador.classList.add('cp-marcador--falha');
    if (elProgressoTexto) {
      elProgressoTexto.textContent = (elProgressoTexto.textContent || '') + ' · Tempo esgotado';
    }
    salvarProgresso('tempo_esgotado', true);
  }

  function abandonarNivel(forcar) {
    if (nivelFinalizado) return;
    nivelFinalizado = true;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    salvarProgresso('abandonado', !!forcar);
  }

  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', function () {
      abandonarNivel(true);
      setTimeout(function () {
        carregarNivel(nivelAtual, true);
      }, 150);
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener('click', function () {
      if (btnProximo.disabled) return;
      if (nivelAtual >= TOTAL_NIVEIS) return;
      carregarNivel(nivelAtual + 1, true);
    });
  }

  if (btnVoltar) {
    btnVoltar.addEventListener('click', function () {
      if (!nivelFinalizado) abandonarNivel(true);
    });
  }

  window.addEventListener('beforeunload', function () {
    if (!nivelFinalizado) abandonarNivel(true);
  });
  window.addEventListener('pagehide', function () {
    if (!nivelFinalizado) abandonarNivel(true);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && !nivelFinalizado) {
      abandonarNivel(true);
    }
  });

  registrarDispositivo();
})();
