const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dispositivo = sequelize.define('Dispositivo', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  dispositivo_id: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ultimo_ip: {
    type: DataTypes.STRING(60),
    allowNull: true
  }
}, {
  tableName: 'dispositivos',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  indexes: [
    { fields: ['dispositivo_id'] }
  ]
});

module.exports = Dispositivo;
