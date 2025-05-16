const { DataTypes } = require('sequelize');
const { sequelize } = require('../data/database');
const Invoice = require('./invoiceModel');
const Product = require('./productModel');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Invoice.hasMany(InvoiceItem, { onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice);

Product.hasMany(InvoiceItem);
InvoiceItem.belongsTo(Product);

module.exports = InvoiceItem;
