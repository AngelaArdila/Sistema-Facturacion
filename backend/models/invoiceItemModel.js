const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define("InvoiceItem", {
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
    ProductId: {
      type: DataTypes.INTEGER,
    },
  });

  return InvoiceItem;
};
