const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

// Rute publik
router.post('/register', userController.registerAdmin);
router.post('/login', userController.login);

module.exports = router;