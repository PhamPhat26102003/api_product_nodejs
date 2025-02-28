const { DataTypes } = require("sequelize");
const sequelize = require("../db/connect");
const OrderItem = require("./orderItem");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true },
);

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

module.exports = Product;
