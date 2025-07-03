// backend/src/controllers/dashboard.controller.js

const { Guest } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const totalGuests = await Guest.count();
    const checkedInCount = await Guest.count({ where: { status: 'checked_in' } });
    
    // Hitung tamu berdasarkan kategori
    const guestsByCategory = await Guest.findAll({
      attributes: ['category', [Guest.sequelize.fn('COUNT', Guest.sequelize.col('id')), 'count']],
      group: ['category'],
      raw: true
    });

    res.status(200).json({
      totalGuests,
      checkedInCount,
      waitingCount: totalGuests - checkedInCount,
      guestsByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};