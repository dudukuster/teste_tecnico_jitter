const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

// Model representando a tabela "items" no banco de dados
const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Order,
      key: 'orderId',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'items',
  timestamps: false,
});

// Relacionamento: um pedido possui muitos itens
Order.hasMany(Item, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Item;
