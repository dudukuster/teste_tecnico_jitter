const Order = require('./Order');
const Item = require('./Item');

// Define os relacionamentos entre order e item
Order.hasMany(Item, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, Item };
