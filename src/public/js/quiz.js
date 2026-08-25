(function () {
  'use strict';

  const STORAGE_DISP_ID = 'mqEdu_dispositivoId';

  const tela = document.querySelector('.tela-quiz');
  const btnVoltar = document.getElementById('quizVoltar');
  const elNivelInfo = document.getElementById('quizNivelInfo');
  const elTimer = document.getElementById('quizTimer');
  const elProgressoBar = document.getElementById('quizProgressoBar');
  const elProgressoTexto = document.getElementById('quizProgressoTexto');
  const elMarcador = document.getElementById('quizMarcador');
  let elQuestoesWrap = document.getElementById('quizQuestoes');
  const btnReiniciar = document.getElementById('quizBotaoReiniciar');
  const btnProximo = document.getElementById('quizBotaoProximo');

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
      if (resp && resp.sucesso && resp.progressos && resp.progressos.quiz && resp.progressos.quiz.nivel_atual) {
        const n = parseInt(resp.progressos.quiz.nivel_atual, 10);
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

    fetch('/api/jogos/quiz/nivel/' + n, {
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
    const nivel = { numero: nivelAtual, tempo_segundos: 20, questoes: [] };
    if (NIVEL_PERGUNTAS_FALLBACK) {
      const ids = NIVEL_PERGUNTAS_FALLBACK.split('|').filter(function (p) { return p.trim(); });
      ids.forEach(function (idStr, idx) {
        const id = parseInt(idStr, 10) || idx + 1;
        nivel.questoes.push({
          id: id,
          pergunta: 'Recarregue a página para carregar as alternativas da pergunta ' + nivelAtual + '.',
          alternativas: { A: 'A', B: 'B', C: 'C', D: 'D' },
          gabarito: 'A'
        });
      });
    }
    if (!nivel.questoes.length) {
      nivel.questoes = [
        { id: 1, pergunta: 'Sem dados do nível. Recarregue a página.', alternativas: { A: 'A', B: 'B', C: 'C', D: 'D' }, gabarito: 'A' }
      ];
    }
    montarNivelComQuestoes(nivel);
  }

  function montarNivelComQuestoes(nivel) {
    questoesAtuais = nivel.questoes.slice();
    const tempoSeg = parseInt(nivel.tempo_segundos, 10) || 20;
    const lista = document.createElement('ul');
    lista.className = 'vf-questoes quiz-questoes';
    lista.id = 'quizQuestoes';

    questoesAtuais.forEach(function (quest) {
      const li = document.createElement('li');
      li.className = 'vf-questao vf-questao--unica quiz-questao';
      li.setAttribute('data-questao-id', String(quest.id));
      li.setAttribute('data-gabarito', String(quest.gabarito || 'A'));
      li.setAttribute('role', 'group');
      li.setAttribute('aria-labelledby', 'quiz-pergunta-' + quest.id);

      const header = document.createElement('div');
      header.className = 'vf-pergunta-cabecalho';
      const numeroEl = document.createElement('span');
      numeroEl.className = 'vf-pergunta-numero';
      numeroEl.textContent = 'Pergunta ' + nivelAtual;
      header.appendChild(numeroEl);

      const p = document.createElement('p');
      p.className = 'vf-pergunta vf-pergunta--grande quiz-pergunta';
      p.id = 'quiz-pergunta-' + quest.id;
      p.textContent = quest.pergunta;

      const opcoes = document.createElement('div');
      opcoes.className = 'quiz-opcoes';
      const letras = ['A', 'B', 'C', 'D'];
      letras.forEach(function (letra) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opcao quiz-opcao--' + letra;
        btn.setAttribute('data-resposta', letra);
        btn.setAttribute('aria-label', 'Alternativa ' + letra);

        const spanLetra = document.createElement('span');
        spanLetra.className = 'quiz-opcao-letra';
        spanLetra.setAttribute('aria-hidden', 'true');
        spanLetra.textContent = letra;

        const spanTexto = document.createElement('span');
        spanTexto.className = 'quiz-opcao-texto';
        spanTexto.textContent = (quest.alternativas && quest.alternativas[letra]) || letra;

        btn.appendChild(spanLetra);
        btn.appendChild(spanTexto);

        btn.addEventListener('click', function () { responderQuestao(quest.id, letra, li); });
        opcoes.appendChild(btn);
      });

      const fb = document.createElement('div');
      fb.className = 'vf-questao-feedback quiz-questao-feedback';
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
    const gabarito = (li.getAttribute('data-gabarito') || 'A').toString();
    respostasAtuais.set(questaoId, {
      questao_id: questaoId,
      resposta: resposta,
      gabarito: gabarito
    });

    const opcoes = li.querySelectorAll('.quiz-opcao');
    opcoes.forEach(function (btn) {
      btn.classList.remove('quiz-opcao--selecionado', 'quiz-opcao--gabarito', 'quiz-opcao--erro');
      btn.disabled = true;
      const letra = btn.getAttribute('data-resposta');
      if (letra === gabarito) btn.classList.add('quiz-opcao--gabarito');
      if (letra === resposta && letra !== gabarito) btn.classList.add('quiz-opcao--erro');
    });
    const selecionado = li.querySelector('.quiz-opcao[data-resposta="' + resposta + '"]');
    if (selecionado) selecionado.classList.add('quiz-opcao--selecionado');

    const acertou = String(resposta) === String(gabarito);
    const feedback = li.querySelector('.quiz-questao-feedback');
    if (feedback) {
      feedback.textContent = acertou ? 'Acertou!' : ('Ops, a resposta correta é a alternativa ' + gabarito + '.');
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
    if (segundosRestantes <= 5) {
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
          gabarito: (quest.gabarito || 'A').toString()
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
      const prom = fetch('/api/jogos/quiz/progresso', {
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
