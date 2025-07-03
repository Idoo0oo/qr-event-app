const { Guest } = require('../models');

exports.createGuest = async (req, res) => {
  try {
    const { name, email, category } = req.body;
    const newGuest = await Guest.create({ name, email, category });
    res.status(201).json({ data: newGuest });
  } catch (error) {
    res.status(400).json({ message: 'Error creating guest', error: error.message });
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