const { Sequelize, Op } = require('sequelize');
const Dispositivo = require('../models/Dispositivo');
const ProgressoCacaPalavras = require('../models/ProgressoCacaPalavras');
const ProgressoVerdadeiroFalso = require('../models/ProgressoVerdadeiroFalso');
const ProgressoQuiz = require('../models/ProgressoQuiz');
const { getTotalNiveisCacaPalavras, getTotalNiveisVerdadeiroFalso, getTotalNiveisQuiz } = require('../models/Jogos');

const formatarNumero = (n) => String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const formatarData = (d) => {
  if (!d) return '-';
  const data = new Date(d);
  if (isNaN(data.getTime())) return '-';
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const aa = data.getFullYear();
  const hh = String(data.getHours()).padStart(2, '0');
  const mi = String(data.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${aa} ${hh}:${mi}`;
};
const curtoId = (id) => {
  const s = String(id || '-');
  if (s.length <= 10) return s;
  return s.slice(0, 4) + '…' + s.slice(-4);
};

class StatsController {
  static async dashboard(req, res) {
    try {
      const [
        totalDispositivos,
        progressoCacaTodos,
        progressoVFTodos,
        progressoQuizTodos
      ] = await Promise.all([
        Dispositivo.count(),
        ProgressoCacaPalavras.findAll({
          attributes: ['dispositivo_id', 'tentativas', 'maior_nivel', 'nivel_atual', 'total_palavras_encontradas', 'resultado_ultima_tentativa', 'atualizado_em'],
          raw: true
        }),
        ProgressoVerdadeiroFalso.findAll({
          attributes: ['dispositivo_id', 'tentativas', 'maior_nivel', 'nivel_atual', 'total_acertos', 'total_perguntas_respondidas', 'resultado_ultima_tentativa', 'atualizado_em'],
          raw: true
        }),
        ProgressoQuiz.findAll({
          attributes: ['dispositivo_id', 'tentativas', 'maior_nivel', 'nivel_atual', 'total_acertos', 'total_perguntas_respondidas', 'resultado_ultima_tentativa', 'atualizado_em'],
          raw: true
        })
      ]);

      const jogaramPorJogo = {
        caca: progressoCacaTodos.filter(p => p.tentativas > 0).length,
        verdadeiroFalso: progressoVFTodos.filter(p => p.tentativas > 0).length,
        quiz: progressoQuizTodos.filter(p => p.tentativas > 0).length
      };

      const idsJogaram = new Set([
        ...progressoCacaTodos.filter(p => p.tentativas > 0).map(p => p.dispositivo_id),
        ...progressoVFTodos.filter(p => p.tentativas > 0).map(p => p.dispositivo_id),
        ...progressoQuizTodos.filter(p => p.tentativas > 0).map(p => p.dispositivo_id)
      ]);
      const totalJogaram = idsJogaram.size;

      const totalNiveis = {
        caca: getTotalNiveisCacaPalavras(),
        verdadeiroFalso: getTotalNiveisVerdadeiroFalso(),
        quiz: getTotalNiveisQuiz()
      };

      const somar = (arr, campo) => arr.reduce((s, p) => s + (Number(p[campo]) || 0), 0);

      const tentativasPorJogo = {
        caca: somar(progressoCacaTodos, 'tentativas'),
        verdadeiroFalso: somar(progressoVFTodos, 'tentativas'),
        quiz: somar(progressoQuizTodos, 'tentativas')
      };

      const totalTentativasGeral = tentativasPorJogo.caca + tentativasPorJogo.verdadeiroFalso + tentativasPorJogo.quiz;

      const maxTentativas = Math.max(1, tentativasPorJogo.caca, tentativasPorJogo.verdadeiroFalso, tentativasPorJogo.quiz);

      const rankingTentativas = [
        { slug: 'caca-palavras', nome: 'Caça-Palavras', cor: '#B66524', tentativas: tentativasPorJogo.caca, pct: Math.round((tentativasPorJogo.caca / maxTentativas) * 100) },
        { slug: 'verdadeiro-ou-falso', nome: 'Verdadeiro ou Falso', cor: '#6C4A8A', tentativas: tentativasPorJogo.verdadeiroFalso, pct: Math.round((tentativasPorJogo.verdadeiroFalso / maxTentativas) * 100) },
        { slug: 'quiz', nome: 'Quiz', cor: '#E8843C', tentativas: tentativasPorJogo.quiz, pct: Math.round((tentativasPorJogo.quiz / maxTentativas) * 100) }
      ].sort((a, b) => b.tentativas - a.tentativas);

      const jogoMaisJogado = rankingTentativas[0];

      const acertosPorJogo = {
        verdadeiroFalso: somar(progressoVFTodos, 'total_acertos'),
        quiz: somar(progressoQuizTodos, 'total_acertos')
      };
      const respondidasPorJogo = {
        verdadeiroFalso: somar(progressoVFTodos, 'total_perguntas_respondidas'),
        quiz: somar(progressoQuizTodos, 'total_perguntas_respondidas')
      };
      const errosPorJogo = {
        verdadeiroFalso: Math.max(0, respondidasPorJogo.verdadeiroFalso - acertosPorJogo.verdadeiroFalso),
        quiz: Math.max(0, respondidasPorJogo.quiz - acertosPorJogo.quiz)
      };

      const pct = (num, den) => den > 0 ? Math.round((num / den) * 100) : 0;

      const acuraciaPorJogo = [
        {
          slug: 'verdadeiro-ou-falso',
          nome: 'Verdadeiro ou Falso',
          cor: '#6C4A8A',
          acertos: acertosPorJogo.verdadeiroFalso,
          erros: errosPorJogo.verdadeiroFalso,
          respondidas: respondidasPorJogo.verdadeiroFalso,
          taxaAcerto: pct(acertosPorJogo.verdadeiroFalso, respondidasPorJogo.verdadeiroFalso),
          taxaErro: pct(errosPorJogo.verdadeiroFalso, respondidasPorJogo.verdadeiroFalso),
          acertosFmt: formatarNumero(acertosPorJogo.verdadeiroFalso),
          errosFmt: formatarNumero(errosPorJogo.verdadeiroFalso),
          respondidasFmt: formatarNumero(respondidasPorJogo.verdadeiroFalso)
        },
        {
          slug: 'quiz',
          nome: 'Quiz',
          cor: '#E8843C',
          acertos: acertosPorJogo.quiz,
          erros: errosPorJogo.quiz,
          respondidas: respondidasPorJogo.quiz,
          taxaAcerto: pct(acertosPorJogo.quiz, respondidasPorJogo.quiz),
          taxaErro: pct(errosPorJogo.quiz, respondidasPorJogo.quiz),
          acertosFmt: formatarNumero(acertosPorJogo.quiz),
          errosFmt: formatarNumero(errosPorJogo.quiz),
          respondidasFmt: formatarNumero(respondidasPorJogo.quiz)
        }
      ];

      const rankingMaioresErros = [...acuraciaPorJogo].sort((a, b) => b.erros - a.erros);
      const rankingMaioresAcertos = [...acuraciaPorJogo].sort((a, b) => b.taxaAcerto - a.taxaAcerto);

      const maiorNivelMedioPorJogo = {
        caca: progressoCacaTodos.length ? Math.round((somar(progressoCacaTodos, 'maior_nivel') / progressoCacaTodos.length) * 10) / 10 : 0,
        verdadeiroFalso: progressoVFTodos.length ? Math.round((somar(progressoVFTodos, 'maior_nivel') / progressoVFTodos.length) * 10) / 10 : 0,
        quiz: progressoQuizTodos.length ? Math.round((somar(progressoQuizTodos, 'maior_nivel') / progressoQuizTodos.length) * 10) / 10 : 0
      };

      const totalPalavrasEncontradas = somar(progressoCacaTodos, 'total_palavras_encontradas');

      const mapaVF = new Map();
      progressoVFTodos.forEach(p => mapaVF.set(p.dispositivo_id, p));
      const mapaQuiz = new Map();
      progressoQuizTodos.forEach(p => mapaQuiz.set(p.dispositivo_id, p));
      const mapaCaca = new Map();
      progressoCacaTodos.forEach(p => mapaCaca.set(p.dispositivo_id, p));

      const todosIds = new Set([
        ...progressoCacaTodos.map(p => p.dispositivo_id),
        ...progressoVFTodos.map(p => p.dispositivo_id),
        ...progressoQuizTodos.map(p => p.dispositivo_id)
      ]);

      const rankingDispositivos = [];
      for (const id of todosIds) {
        const vf = mapaVF.get(id) || { total_acertos: 0, total_perguntas_respondidas: 0, tentativas: 0, maior_nivel: 1, atualizado_em: null };
        const qz = mapaQuiz.get(id) || { total_acertos: 0, total_perguntas_respondidas: 0, tentativas: 0, maior_nivel: 1, atualizado_em: null };
        const cc = mapaCaca.get(id) || { tentativas: 0, maior_nivel: 1, total_palavras_encontradas: 0, atualizado_em: null };
        const totalAcertos = (vf.total_acertos || 0) + (qz.total_acertos || 0);
        const totalRespondidas = (vf.total_perguntas_respondidas || 0) + (qz.total_perguntas_respondidas || 0);
        const totalTentativas = (vf.tentativas || 0) + (qz.tentativas || 0) + (cc.tentativas || 0);
        const datas = [vf.atualizado_em, qz.atualizado_em, cc.atualizado_em].filter(Boolean);
        const ultimaAtividade = datas.length ? new Date(Math.max(...datas.map(d => new Date(d).getTime()))) : null;
        rankingDispositivos.push({
          dispositivo_id: id,
          dispositivo_curto: curtoId(id),
          totalAcertos,
          totalAcertosFmt: formatarNumero(totalAcertos),
          totalRespondidas,
          totalRespondidasFmt: formatarNumero(totalRespondidas),
          taxaAcerto: pct(totalAcertos, totalRespondidas),
          totalTentativas,
          totalTentativasFmt: formatarNumero(totalTentativas),
          maiorNivelMax: Math.max(vf.maior_nivel || 1, qz.maior_nivel || 1, cc.maior_nivel || 1),
          palavrasCaca: cc.total_palavras_encontradas || 0,
          ultimaAtividade: formatarData(ultimaAtividade)
        });
      }

      const rankingTopAcertos = rankingDispositivos
        .filter(d => d.totalRespondidas > 0)
        .sort((a, b) => b.totalAcertos - a.totalAcertos || b.taxaAcerto - a.taxaAcerto)
        .slice(0, 10)
        .map((d, i) => ({ ...d, posicao: i + 1 }));

      const rankingBottomAcertos = rankingDispositivos
        .filter(d => d.totalRespondidas > 0)
        .sort((a, b) => a.totalAcertos - b.totalAcertos || a.taxaAcerto - b.taxaAcerto)
        .slice(0, 10)
        .map((d, i) => ({ ...d, posicao: i + 1 }));

      const topMaiorProgresso = rankingDispositivos
        .sort((a, b) => b.maiorNivelMax - a.maiorNivelMax || b.totalTentativas - a.totalTentativas)
        .slice(0, 10)
        .map((d, i) => ({ ...d, posicao: i + 1 }));

      const totalRespondidasGeral = respondidasPorJogo.verdadeiroFalso + respondidasPorJogo.quiz;
      const totalAcertosGeral = acertosPorJogo.verdadeiroFalso + acertosPorJogo.quiz;
      const totalErrosGeral = totalRespondidasGeral - totalAcertosGeral;
      const taxaAcertoGeral = pct(totalAcertosGeral, totalRespondidasGeral);

      const nomeJogoMaisErros = rankingMaioresErros[0] ? rankingMaioresErros[0].nome : '-';
      const nomeJogoMaisAcertos = rankingMaioresAcertos[0] ? rankingMaioresAcertos[0].nome : '-';

      const dados = {
        title: 'Painel de Estatísticas - Memórias que Educam',
        resumo: {
          totalDispositivos,
          totalDispositivosFmt: formatarNumero(totalDispositivos),
          totalJogaram,
          totalJogaramFmt: formatarNumero(totalJogaram),
          totalTentativasGeral,
          totalTentativasGeralFmt: formatarNumero(totalTentativasGeral),
          totalRespondidasGeral,
          totalRespondidasGeralFmt: formatarNumero(totalRespondidasGeral),
          totalAcertosGeral,
          totalAcertosGeralFmt: formatarNumero(totalAcertosGeral),
          totalErrosGeral,
          totalErrosGeralFmt: formatarNumero(totalErrosGeral),
          taxaAcertoGeral,
          totalPalavrasEncontradas,
          totalPalavrasEncontradasFmt: formatarNumero(totalPalavrasEncontradas)
        },
        porJogo: {
          niveis: totalNiveis,
          tentativas: tentativasPorJogo,
          jogaram: jogaramPorJogo,
          maiorNivelMedio: maiorNivelMedioPorJogo
        },
        rankingTentativas,
        jogoMaisJogado: jogoMaisJogado ? { ...jogoMaisJogado, tentativasFmt: formatarNumero(jogoMaisJogado.tentativas) } : null,
        acuraciaPorJogo,
        rankingMaioresErros,
        rankingMaioresAcertos,
        nomeJogoMaisErros,
        nomeJogoMaisAcertos,
        rankingTopAcertos,
        rankingBottomAcertos,
        topMaiorProgresso,
        geradoEm: formatarData(new Date())
      };

      res.render('stats/dashboard', dados);
    } catch (err) {
      console.error('Erro ao carregar dashboard stats:', err);
      res.status(500).send('Erro interno ao carregar estatísticas.');
    }
  }
}

module.exports = StatsController;

