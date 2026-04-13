const User = require('./User');
const Product = require('./Product');
const Client = require('./Client');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');

Client.hasMany(Sale, { foreignKey: 'clientId' });
Sale.belongsTo(Client, { foreignKey: 'clientId' });

Sale.hasMany(SaleItem, { foreignKey: 'saleId' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });

Product.hasMany(SaleItem, { foreignKey: 'productId' });
SaleItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  User,
  Product,
  Client,
  Sale,
  SaleItem
};
