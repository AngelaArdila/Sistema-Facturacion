const { Sequelize } = require('sequelize');
const path = require('path');

// Ruta al archivo SQLite dentro del directorio 'data'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data', 'facturacion.sqlite'),
  logging: false, // puedes poner true para ver los logs de SQL
});

module.exports = { sequelize };