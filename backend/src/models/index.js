const { sequelize } = require('../config/database');
const User = require('./user.model');
const Guest = require('./guest.model');

const db = {
  sequelize,
  User,
  Guest,
};

db.sync = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ An error occurred while synchronizing the models:', error);
  }
};

module.exports = db;