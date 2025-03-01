const express = require("express");
const app = express();
const router = require("./src/route/api");
const sequelize = require("./src/db/connect");
const path = require("path");
const cors = require("cors");
const User = require("./src/model/user");
const Product = require("./src/model/product");
const Cart = require("./src/model/cart");
const CartItem = require("./src/model/cartItem");
const Order = require("./src/model/order");
const OrderItem = require("./src/model/orderItem");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cho phép tất cả các domain truy cập API
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/product", router);

const port = process.env.PORT || 8089;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () =>
      console.log("Restful API server started on: " + port),
    );
  })
  .catch((err) => {
    console.log("Error with connect to database: ", err);
    process.exit(0);
  });

module.exports = { User, Product, Cart, CartItem, Order, OrderItem };
