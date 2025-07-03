const express = require('express');
const guestController = require('../controllers/guest.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Melindungi semua rute di bawah ini dengan middleware otentikasi
router.use(authMiddleware);

router.post('/', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);
router.post('/:id/checkin', guestController.manualCheckin);

module.exports = router;