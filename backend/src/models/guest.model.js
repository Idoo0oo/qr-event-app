const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Guest = sequelize.define('Guest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('waiting', 'checked_in'),
    defaultValue: 'waiting',
    allowNull: false,
  },
  checkedInAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'guests' // Eksplisit nama tabel
});

module.exports = Guest;