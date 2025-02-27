const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const User = require("./user");

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  },
  { timestamps: true },
);

Cart.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

module.exports = Cart;
