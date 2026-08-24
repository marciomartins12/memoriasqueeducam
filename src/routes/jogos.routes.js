const express = require('express');
const JogosController = require('../controllers/JogosController');

const router = express.Router();

router.get('/jogos', JogosController.index);
router.get('/jogos/caca-palavras', JogosController.cacaPalavras);
router.get('/jogos/verdadeiro-ou-falso', JogosController.verdadeiroFalso);
router.get('/api/jogos/caca-palavras/nivel/:nivel', JogosController.getNivelCacaPalavrasApi);
router.get('/api/jogos/verdadeiro-ou-falso/nivel/:nivel', JogosController.getNivelVerdadeiroFalsoApi);
router.post('/api/jogos/dispositivo', JogosController.registrarDispositivo);
router.post('/api/jogos/caca-palavras/progresso', JogosController.salvarProgressoCacaPalavras);
router.post('/api/jogos/verdadeiro-ou-falso/progresso', JogosController.salvarProgressoVerdadeiroFalso);

module.exports = router;
