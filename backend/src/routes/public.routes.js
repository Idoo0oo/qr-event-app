const express = require('express');
const guestController = require('../controllers/guest.controller');
const router = express.Router();

// Rute ini publik, tidak perlu otentikasi
router.post('/register-guest', guestController.selfRegisterGuest);

module.exports = router;