const { Guest } = require('../models');
const { sendInvitationEmail } = require('../services/email.service');

exports.createGuest = async (req, res) => {
  try {
    const { name, email, category } = req.body;
    const newGuest = await Guest.create({ name, email, category });
    sendInvitationEmail(newGuest);
    res.status(201).json({ data: newGuest });
  } catch (error) {
    res.status(400).json({ message: 'Error creating guest', error: error.message });
  }
};

exports.selfRegisterGuest = async (req, res) => {
  try {
    const { name, email, category } = req.body;
    
    // Validasi dasar
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Cek apakah email sudah terdaftar
    const existingGuest = await Guest.findOne({ where: { email } });
    if (existingGuest) {
        return res.status(409).json({ message: 'This email address has already been registered.' });
    }

    const newGuest = await Guest.create({ name, email, category });

    // Kirim email undangan setelah berhasil mendaftar
    await sendInvitationEmail(newGuest);

    res.status(201).json({ 
        message: 'Registration successful! Please check your email for the QR code invitation.',
        data: { id: newGuest.id, name: newGuest.name } 
    });
  } catch (error) {
    // Tangani error validasi (misalnya email tidak valid)
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: 'Invalid data provided.', error: error.message });
    }
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};

exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ data: guests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guests', error: error.message });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.status(200).json({ data: guest });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guest', error: error.message });
  }
};

exports.updateGuest = async (req, res) => {
    try {
        const { name, email, category } = req.body;
        const guest = await Guest.findByPk(req.params.id);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        await guest.update({ name, email, category });
        res.status(200).json({ data: guest });
    } catch (error) {
        res.status(400).json({ message: 'Error updating guest', error: error.message });
    }
};

exports.deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findByPk(req.params.id);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        await guest.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: 'Error deleting guest', error: error.message });
    }
};