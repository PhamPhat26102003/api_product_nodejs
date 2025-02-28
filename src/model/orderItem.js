const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const Order = require("./order");
const Product = require("./product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  { timestamps: true },
);

OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
  });
  OrderItem.belongsTo(models.Product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
  });
};

module.exports = OrderItem;
