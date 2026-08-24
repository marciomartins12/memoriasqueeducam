const express = require('express');
const GaleriaController = require('../controllers/GaleriaController');

const router = express.Router();

router.get('/galeria', GaleriaController.index);

module.exports = router;
