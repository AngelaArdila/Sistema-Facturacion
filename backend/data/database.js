const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Ruta al archivo SQLite dentro del directorio 'data'
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "data", "facturacion.sqlite"),
  logging: false, // puedes poner true para ver los logs de SQL
});

const Customer = require("../models/customerModel")(sequelize, DataTypes);
const Invoice = require("../models/invoiceModel")(sequelize, DataTypes);
const InvoiceItem = require("../models/invoiceItemModel")(sequelize, DataTypes);
const Product = require("../models/productModel")(sequelize, DataTypes);

Customer.hasMany(Invoice, { foreignKey: "CustomerId", as: "invoices" });
Invoice.hasMany(InvoiceItem, { foreignKey: "InvoiceId", as: "invoiceItems" });
Product.hasMany(InvoiceItem, { foreignKey: "ProductId", as: "product" });

Invoice.belongsTo(Customer, { foreignKey: "CustomerId", as: "customer" });
InvoiceItem.belongsTo(Product, { foreignKey: "ProductId", as: "product" });

module.exports = { sequelize, Customer, Invoice, Product, InvoiceItem };
