const express = require('express');
const homeRoutes = require('./home.routes');
const dashboardRoutes = require('./dashboard.routes');
const comunidadesRoutes = require('./comunidades.routes');
const moradoresRoutes = require('./moradores.routes');
const saberesRoutes = require('./saberes.routes');
const galeriaRoutes = require('./galeria.routes');
const jogosRoutes = require('./jogos.routes');

const router = express.Router();

router.use('/', homeRoutes);
router.use('/', dashboardRoutes);
router.use('/', comunidadesRoutes);
router.use('/', moradoresRoutes);
router.use('/', saberesRoutes);
router.use('/', galeriaRoutes);
router.use('/', jogosRoutes);

module.exports = router;
