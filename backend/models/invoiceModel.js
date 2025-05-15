const { DataTypes } = require('sequelize');
const { sequelize } = require('../data/database');
const Customer = require('./customerModel');

const Invoice = sequelize.define('Invoice', {
  invoiceNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Customer.hasMany(Invoice, { onDelete: 'CASCADE' });
Invoice.belongsTo(Customer);

module.exports = Invoice;
