const express = require('express');
const JogosController = require('../controllers/JogosController');
const StatsController = require('../controllers/StatsController');

const router = express.Router();

router.get('/jogos', JogosController.index);
router.get('/jogos/caca-palavras', JogosController.cacaPalavras);
router.get('/jogos/verdadeiro-ou-falso', JogosController.verdadeiroFalso);
router.get('/jogos/quiz', JogosController.quiz);
router.get('/painel-estatisticas-memorias-educam-2026', StatsController.dashboard);
router.get('/api/jogos/caca-palavras/nivel/:nivel', JogosController.getNivelCacaPalavrasApi);
router.get('/api/jogos/verdadeiro-ou-falso/nivel/:nivel', JogosController.getNivelVerdadeiroFalsoApi);
router.get('/api/jogos/quiz/nivel/:nivel', JogosController.getNivelQuizApi);
router.post('/api/jogos/dispositivo', JogosController.registrarDispositivo);
router.post('/api/jogos/caca-palavras/progresso', JogosController.salvarProgressoCacaPalavras);
router.post('/api/jogos/verdadeiro-ou-falso/progresso', JogosController.salvarProgressoVerdadeiroFalso);
router.post('/api/jogos/quiz/progresso', JogosController.salvarProgressoQuiz);

module.exports = router;
