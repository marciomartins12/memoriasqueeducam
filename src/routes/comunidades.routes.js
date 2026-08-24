const express = require('express');
const ComunidadesController = require('../controllers/ComunidadesController');

const router = express.Router();

router.get('/comunidades', ComunidadesController.index);

module.exports = router;
