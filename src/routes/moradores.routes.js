const express = require('express');
const MoradoresController = require('../controllers/MoradoresController');

const router = express.Router();

router.get('/moradores', MoradoresController.index);

module.exports = router;
