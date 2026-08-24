const express = require('express');
const DashboardController = require('../controllers/DashboardController');

const router = express.Router();

router.get('/dashboard', DashboardController.index);
router.get('/sobre', DashboardController.sobre);

module.exports = router;
