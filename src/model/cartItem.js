const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Cart = require("./cart");
const Product = require("./product");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { timestamps: true },
);

CartItem.belongsTo(Cart, { foreignKey: "cart_id", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });

module.exports = CartItem;
