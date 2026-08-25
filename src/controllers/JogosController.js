const { listarJogos, getJogo, getNivelCacaPalavras, getTotalNiveisCacaPalavras, getNivelVerdadeiroFalso, getTotalNiveisVerdadeiroFalso, getNivelQuiz, getTotalNiveisQuiz } = require('../models/Jogos');
const Dispositivo = require('../models/Dispositivo');
const ProgressoCacaPalavras = require('../models/ProgressoCacaPalavras');
const ProgressoVerdadeiroFalso = require('../models/ProgressoVerdadeiroFalso');
const ProgressoQuiz = require('../models/ProgressoQuiz');
const sequelize = require('../config/database');

class JogosController {
  static async index(req, res) {
    try {
      const jogos = listarJogos();
      return res.render('jogos/index', {
        title: 'Jogos Educativos',
        jogos: jogos
      });
    } catch (err) {
      console.error('Erro ao carregar página de jogos:', err);
      return res.redirect('/dashboard');
    }
  }

  static async cacaPalavras(req, res) {
    try {
      const jogo = getJogo('caca-palavras');
      if (!jogo) {
        return res.redirect('/jogos');
      }
      const totalNiveis = getTotalNiveisCacaPalavras();
      const nivelInicial = getNivelCacaPalavras(1);
      return res.render('jogos/caca-palavras', {
        title: 'Caça-Palavras - Jogos Educativos',
        jogo: jogo,
        totalNiveis: totalNiveis,
        nivelInicial: nivelInicial
      });
    } catch (err) {
      console.error('Erro ao carregar caça-palavras:', err);
      return res.redirect('/jogos');
    }
  }

  static async verdadeiroFalso(req, res) {
    try {
      const jogo = getJogo('verdadeiro-ou-falso');
      if (!jogo) {
        return res.redirect('/jogos');
      }
      const totalNiveis = getTotalNiveisVerdadeiroFalso();
      const nivelInicial = getNivelVerdadeiroFalso(1);
      return res.render('jogos/verdadeiro-falso', {
        title: 'Verdadeiro ou Falso - Jogos Educativos',
        jogo: jogo,
        totalNiveis: totalNiveis,
        nivelInicial: nivelInicial
      });
    } catch (err) {
      console.error('Erro ao carregar verdadeiro-ou-falso:', err);
      return res.redirect('/jogos');
    }
  }

  static async quiz(req, res) {
    try {
      const jogo = getJogo('quiz');
      if (!jogo) {
        return res.redirect('/jogos');
      }
      const totalNiveis = getTotalNiveisQuiz();
      const nivelInicial = getNivelQuiz(1);
      return res.render('jogos/quiz', {
        title: 'Quiz - Jogos Educativos',
        jogo: jogo,
        totalNiveis: totalNiveis,
        nivelInicial: nivelInicial
      });
    } catch (err) {
      console.error('Erro ao carregar quiz:', err);
      return res.redirect('/jogos');
    }
  }

  static async getNivelCacaPalavrasApi(req, res) {
    try {
      const { nivel } = req.params;
      const numero = parseInt(nivel, 10);
      if (isNaN(numero) || numero < 1 || numero > getTotalNiveisCacaPalavras()) {
        return res.status(404).json({ erro: 'Nível inválido' });
      }
      const dados = getNivelCacaPalavras(numero);
      return res.json({ sucesso: true, nivel: dados });
    } catch (err) {
      console.error('Erro ao pegar nível:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async getNivelVerdadeiroFalsoApi(req, res) {
    try {
      const { nivel } = req.params;
      const numero = parseInt(nivel, 10);
      if (isNaN(numero) || numero < 1 || numero > getTotalNiveisVerdadeiroFalso()) {
        return res.status(404).json({ erro: 'Nível inválido' });
      }
      const dados = getNivelVerdadeiroFalso(numero);
      return res.json({ sucesso: true, nivel: dados });
    } catch (err) {
      console.error('Erro ao pegar nível verdadeiro/falso:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async getNivelQuizApi(req, res) {
    try {
      const { nivel } = req.params;
      const numero = parseInt(nivel, 10);
      if (isNaN(numero) || numero < 1 || numero > getTotalNiveisQuiz()) {
        return res.status(404).json({ erro: 'Nível inválido' });
      }
      const dados = getNivelQuiz(numero);
      return res.json({ sucesso: true, nivel: dados });
    } catch (err) {
      console.error('Erro ao pegar nível quiz:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async registrarDispositivo(req, res) {
    const t = await sequelize.transaction();
    try {
      const { dispositivo_id, user_agent } = req.body || {};
      if (!dispositivo_id || typeof dispositivo_id !== 'string') {
        await t.rollback();
        return res.status(400).json({ erro: 'dispositivo_id obrigatório' });
      }
      const idTrim = dispositivo_id.trim().slice(0, 120);
      const ip = (req.ip || req.connection?.remoteAddress || '').toString().slice(0, 60);
      let disp = await Dispositivo.findOne({ where: { dispositivo_id: idTrim }, transaction: t });
      if (!disp) {
        disp = await Dispositivo.create({
          dispositivo_id: idTrim,
          user_agent: user_agent ? String(user_agent).slice(0, 5000) : null,
          ultimo_ip: ip || null
        }, { transaction: t });
      } else {
        disp.ultimo_ip = ip || disp.ultimo_ip;
        if (user_agent) disp.user_agent = String(user_agent).slice(0, 5000);
        await disp.save({ transaction: t });
      }

      let progressoCaca = await ProgressoCacaPalavras.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t
      });
      if (!progressoCaca) {
        progressoCaca = await ProgressoCacaPalavras.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_palavras_encontradas: 0
        }, { transaction: t });
      }

      let progressoVf = await ProgressoVerdadeiroFalso.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t
      });
      if (!progressoVf) {
        progressoVf = await ProgressoVerdadeiroFalso.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_acertos: 0,
          total_perguntas_respondidas: 0
        }, { transaction: t });
      }

      let progressoQuiz = await ProgressoQuiz.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t
      });
      if (!progressoQuiz) {
        progressoQuiz = await ProgressoQuiz.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_acertos: 0,
          total_perguntas_respondidas: 0
        }, { transaction: t });
      }

      await t.commit();
      return res.json({
        sucesso: true,
        dispositivo: {
          dispositivo_id: disp.dispositivo_id
        },
        progressos: {
          cacaPalavras: {
            maior_nivel: progressoCaca.maior_nivel,
            nivel_atual: progressoCaca.nivel_atual,
            tentativas: progressoCaca.tentativas,
            total_palavras_encontradas: progressoCaca.total_palavras_encontradas,
            ultimo_nivel_completo: progressoCaca.ultimo_nivel_completo || null
          },
          verdadeiroFalso: {
            maior_nivel: progressoVf.maior_nivel,
            nivel_atual: progressoVf.nivel_atual,
            tentativas: progressoVf.tentativas,
            total_acertos: progressoVf.total_acertos,
            total_perguntas_respondidas: progressoVf.total_perguntas_respondidas,
            ultimo_nivel_completo: progressoVf.ultimo_nivel_completo || null
          },
          quiz: {
            maior_nivel: progressoQuiz.maior_nivel,
            nivel_atual: progressoQuiz.nivel_atual,
            tentativas: progressoQuiz.tentativas,
            total_acertos: progressoQuiz.total_acertos,
            total_perguntas_respondidas: progressoQuiz.total_perguntas_respondidas,
            ultimo_nivel_completo: progressoQuiz.ultimo_nivel_completo || null
          }
        }
      });
    } catch (err) {
      try { await t.rollback(); } catch (e) {}
      console.error('Erro ao registrar dispositivo:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async salvarProgressoCacaPalavras(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        dispositivo_id,
        nivel,
        palavras_encontradas = [],
        total_palavras,
        resultado
      } = req.body || {};

      if (!dispositivo_id || typeof dispositivo_id !== 'string') {
        await t.rollback();
        return res.status(400).json({ erro: 'dispositivo_id obrigatório' });
      }
      const idTrim = dispositivo_id.trim().slice(0, 120);
      const disp = await Dispositivo.findOne({
        where: { dispositivo_id: idTrim },
        transaction: t
      });
      if (!disp) {
        await t.rollback();
        return res.status(404).json({ erro: 'Dispositivo não encontrado, registre primeiro' });
      }

      let progresso = await ProgressoCacaPalavras.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t,
        lock: true
      });
      if (!progresso) {
        progresso = await ProgressoCacaPalavras.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_palavras_encontradas: 0
        }, { transaction: t });
      }

      const n = parseInt(nivel, 10);
      const nivelValido = !isNaN(n) && n >= 1 && n <= getTotalNiveisCacaPalavras();
      const qtdEncontradas = Array.isArray(palavras_encontradas) ? palavras_encontradas.length : 0;
      const resultadoValido = ['concluido', 'tempo_esgotado', 'abandonado', 'nivel_perdido'].includes(String(resultado));

      progresso.tentativas = (progresso.tentativas || 0) + 1;
      progresso.total_palavras_encontradas = (progresso.total_palavras_encontradas || 0) + qtdEncontradas;

      if (nivelValido) {
        progresso.ultimo_nivel_jogado = n;
        if (n > (progresso.maior_nivel || 1)) {
          progresso.maior_nivel = n;
        }
        const proxNivel = n + 1;
        if (resultado === 'concluido') {
          progresso.ultimo_nivel_completo = n;
          if (proxNivel <= getTotalNiveisCacaPalavras()) {
            if (proxNivel > (progresso.nivel_atual || 1)) {
              progresso.nivel_atual = proxNivel;
            }
          } else {
            progresso.nivel_atual = getTotalNiveisCacaPalavras();
          }
        } else {
          progresso.nivel_atual = n;
        }
      }

      if (resultadoValido) {
        progresso.resultado_ultima_tentativa = resultado;
      }

      if (nivelValido) {
        try {
          progresso.progresso_ultimo_nivel = {
            nivel: n,
            total_palavras: total_palavras || null,
            palavras_encontradas: Array.isArray(palavras_encontradas) ? palavras_encontradas.slice(0, 50) : [],
            resultado: resultadoValido ? resultado : null
          };
        } catch (e) {}
      }

      await progresso.save({ transaction: t });
      await t.commit();

      return res.json({
        sucesso: true,
        progresso: {
          maior_nivel: progresso.maior_nivel,
          nivel_atual: progresso.nivel_atual,
          tentativas: progresso.tentativas,
          total_palavras_encontradas: progresso.total_palavras_encontradas,
          ultimo_nivel_completo: progresso.ultimo_nivel_completo || null,
          resultado_ultima_tentativa: progresso.resultado_ultima_tentativa || null
        }
      });
    } catch (err) {
      try { await t.rollback(); } catch (e) {}
      console.error('Erro ao salvar progresso:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async salvarProgressoVerdadeiroFalso(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        dispositivo_id,
        nivel,
        respostas = [],
        total_questoes,
        resultado
      } = req.body || {};

      if (!dispositivo_id || typeof dispositivo_id !== 'string') {
        await t.rollback();
        return res.status(400).json({ erro: 'dispositivo_id obrigatório' });
      }
      const idTrim = dispositivo_id.trim().slice(0, 120);
      const disp = await Dispositivo.findOne({
        where: { dispositivo_id: idTrim },
        transaction: t
      });
      if (!disp) {
        await t.rollback();
        return res.status(404).json({ erro: 'Dispositivo não encontrado, registre primeiro' });
      }

      let progresso = await ProgressoVerdadeiroFalso.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t,
        lock: true
      });
      if (!progresso) {
        progresso = await ProgressoVerdadeiroFalso.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_acertos: 0,
          total_perguntas_respondidas: 0
        }, { transaction: t });
      }

      const n = parseInt(nivel, 10);
      const nivelValido = !isNaN(n) && n >= 1 && n <= getTotalNiveisVerdadeiroFalso();
      const resultadoValido = ['concluido', 'tempo_esgotado', 'abandonado', 'nivel_perdido'].includes(String(resultado));
      const respostasArr = Array.isArray(respostas) ? respostas.slice(0, 300) : [];
      const qtdRespondidas = respostasArr.filter(function (r) {
        return r && (r.resposta === true || r.resposta === false || r.resposta === null || typeof r.resposta === 'boolean');
      }).length;
      const qtdAcertos = respostasArr.filter(function (r) {
        return r && r.resposta === true && r.gabarito === true || r && r.resposta === false && r.gabarito === false;
      }).length;

      progresso.tentativas = (progresso.tentativas || 0) + 1;
      progresso.total_perguntas_respondidas = (progresso.total_perguntas_respondidas || 0) + qtdRespondidas;
      progresso.total_acertos = (progresso.total_acertos || 0) + qtdAcertos;

      if (nivelValido) {
        progresso.ultimo_nivel_jogado = n;
        if (n > (progresso.maior_nivel || 1)) {
          progresso.maior_nivel = n;
        }
        const proxNivel = n + 1;
        if (resultado === 'concluido') {
          progresso.ultimo_nivel_completo = n;
          if (proxNivel <= getTotalNiveisVerdadeiroFalso()) {
            if (proxNivel > (progresso.nivel_atual || 1)) {
              progresso.nivel_atual = proxNivel;
            }
          } else {
            progresso.nivel_atual = getTotalNiveisVerdadeiroFalso();
          }
        } else {
          progresso.nivel_atual = n;
        }
      }

      if (resultadoValido) {
        progresso.resultado_ultima_tentativa = resultado;
      }

      if (nivelValido) {
        try {
          progresso.progresso_ultimo_nivel = {
            nivel: n,
            total_questoes: total_questoes || null,
            qtd_respondidas: qtdRespondidas,
            qtd_acertos: qtdAcertos,
            respostas: respostasArr,
            resultado: resultadoValido ? resultado : null
          };
        } catch (e) {}
      }

      await progresso.save({ transaction: t });
      await t.commit();

      return res.json({
        sucesso: true,
        progresso: {
          maior_nivel: progresso.maior_nivel,
          nivel_atual: progresso.nivel_atual,
          tentativas: progresso.tentativas,
          total_acertos: progresso.total_acertos,
          total_perguntas_respondidas: progresso.total_perguntas_respondidas,
          ultimo_nivel_completo: progresso.ultimo_nivel_completo || null,
          resultado_ultima_tentativa: progresso.resultado_ultima_tentativa || null,
          qtd_acertos_nivel: qtdAcertos,
          qtd_respondidas_nivel: qtdRespondidas
        }
      });
    } catch (err) {
      try { await t.rollback(); } catch (e) {}
      console.error('Erro ao salvar progresso verdadeiro/falso:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }

  static async salvarProgressoQuiz(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        dispositivo_id,
        nivel,
        respostas = [],
        total_questoes,
        resultado
      } = req.body || {};

      if (!dispositivo_id || typeof dispositivo_id !== 'string') {
        await t.rollback();
        return res.status(400).json({ erro: 'dispositivo_id obrigatório' });
      }
      const idTrim = dispositivo_id.trim().slice(0, 120);
      const disp = await Dispositivo.findOne({
        where: { dispositivo_id: idTrim },
        transaction: t
      });
      if (!disp) {
        await t.rollback();
        return res.status(404).json({ erro: 'Dispositivo não encontrado, registre primeiro' });
      }

      let progresso = await ProgressoQuiz.findOne({
        where: { dispositivo_id: disp.id },
        transaction: t,
        lock: true
      });
      if (!progresso) {
        progresso = await ProgressoQuiz.create({
          dispositivo_id: disp.id,
          maior_nivel: 1,
          nivel_atual: 1,
          tentativas: 0,
          total_acertos: 0,
          total_perguntas_respondidas: 0
        }, { transaction: t });
      }

      const n = parseInt(nivel, 10);
      const nivelValido = !isNaN(n) && n >= 1 && n <= getTotalNiveisQuiz();
      const resultadoValido = ['concluido', 'tempo_esgotado', 'abandonado', 'nivel_perdido'].includes(String(resultado));
      const respostasArr = Array.isArray(respostas) ? respostas.slice(0, 300) : [];
      const qtdRespondidas = respostasArr.filter(function (r) {
        return r && (r.resposta === 'A' || r.resposta === 'B' || r.resposta === 'C' || r.resposta === 'D' || r.resposta === null);
      }).length;
      const qtdAcertos = respostasArr.filter(function (r) {
        return r && typeof r.resposta === 'string' && r.resposta === r.gabarito;
      }).length;

      progresso.tentativas = (progresso.tentativas || 0) + 1;
      progresso.total_perguntas_respondidas = (progresso.total_perguntas_respondidas || 0) + qtdRespondidas;
      progresso.total_acertos = (progresso.total_acertos || 0) + qtdAcertos;

      if (nivelValido) {
        progresso.ultimo_nivel_jogado = n;
        if (n > (progresso.maior_nivel || 1)) {
          progresso.maior_nivel = n;
        }
        const proxNivel = n + 1;
        if (resultado === 'concluido') {
          progresso.ultimo_nivel_completo = n;
          if (proxNivel <= getTotalNiveisQuiz()) {
            if (proxNivel > (progresso.nivel_atual || 1)) {
              progresso.nivel_atual = proxNivel;
            }
          } else {
            progresso.nivel_atual = getTotalNiveisQuiz();
          }
        } else {
          progresso.nivel_atual = n;
        }
      }

      if (resultadoValido) {
        progresso.resultado_ultima_tentativa = resultado;
      }

      if (nivelValido) {
        try {
          progresso.progresso_ultimo_nivel = {
            nivel: n,
            total_questoes: total_questoes || null,
            qtd_respondidas: qtdRespondidas,
            qtd_acertos: qtdAcertos,
            respostas: respostasArr,
            resultado: resultadoValido ? resultado : null
          };
        } catch (e) {}
      }

      await progresso.save({ transaction: t });
      await t.commit();

      return res.json({
        sucesso: true,
        progresso: {
          maior_nivel: progresso.maior_nivel,
          nivel_atual: progresso.nivel_atual,
          tentativas: progresso.tentativas,
          total_acertos: progresso.total_acertos,
          total_perguntas_respondidas: progresso.total_perguntas_respondidas,
          ultimo_nivel_completo: progresso.ultimo_nivel_completo || null,
          resultado_ultima_tentativa: progresso.resultado_ultima_tentativa || null,
          qtd_acertos_nivel: qtdAcertos,
          qtd_respondidas_nivel: qtdRespondidas
        }
      });
    } catch (err) {
      try { await t.rollback(); } catch (e) {}
      console.error('Erro ao salvar progresso quiz:', err);
      return res.status(500).json({ erro: 'Erro interno' });
    }
  }
}

module.exports = JogosController;
