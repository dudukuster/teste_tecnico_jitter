const Order = require('./Order');
const Item = require('./Item');

// Define os relacionamentos entre os models em um único lugar
Order.hasMany(Item, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, Item };
