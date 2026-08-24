const express = require('express');
const SaberesController = require('../controllers/SaberesController');

const router = express.Router();

router.get('/saberes', SaberesController.index);
router.get('/saberes/:slug', SaberesController.categoria);

module.exports = router;
