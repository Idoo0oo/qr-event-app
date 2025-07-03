// backend/src/routes/dashboard.routes.js

const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Semua rute di sini memerlukan otentikasi
router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);

module.exports = router;