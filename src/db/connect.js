const { Sequelize } = require("sequelize");
require("dotenv").config();

// Kết nối tới cơ sở dữ liệu
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // Hoặc bạn có thể sử dụng 'postgres', 'sqlite', v.v.
  },
);

module.exports = sequelize;
