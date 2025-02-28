const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const OrderItem = require("./orderItem");
const User = require("./user");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.FLOAT, allowNull: false },
  },
  { timestamps: true },
);

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
  Order.hasMany(models.OrderItem, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
  });
};

module.exports = Order;
