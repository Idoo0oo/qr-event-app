const express = require('express');
const checkinController = require('../controllers/checkin.controller');
const router = express.Router();

// Rute ini publik, tidak perlu otentikasi admin
router.post('/', checkinController.handleCheckin);

module.exports = router;