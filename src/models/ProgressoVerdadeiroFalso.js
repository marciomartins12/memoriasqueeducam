const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Dispositivo = require('./Dispositivo');

const ProgressoVerdadeiroFalso = sequelize.define('ProgressoVerdadeiroFalso', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  dispositivo_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'dispositivos',
      key: 'id'
    }
  },
  maior_nivel: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },
  nivel_atual: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },
  tentativas: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  total_acertos: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  total_perguntas_respondidas: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  ultimo_nivel_jogado: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true
  },
  ultimo_nivel_completo: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true
  },
  resultado_ultima_tentativa: {
    type: DataTypes.ENUM('concluido', 'tempo_esgotado', 'abandonado', 'nivel_perdido'),
    allowNull: true
  },
  progresso_ultimo_nivel: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'progresso_verdadeiro_falso',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
  indexes: [
    { fields: ['dispositivo_id'], unique: true }
  ]
});

ProgressoVerdadeiroFalso.belongsTo(Dispositivo, {
  foreignKey: 'dispositivo_id',
  as: 'dispositivo'
});

module.exports = ProgressoVerdadeiroFalso;
