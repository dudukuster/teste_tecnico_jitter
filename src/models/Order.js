const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model representando a tabela "orders" no banco de dados
const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;
