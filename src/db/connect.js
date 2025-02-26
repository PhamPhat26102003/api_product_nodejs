const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectToDatabase = async () => {
  try {
    await pool.getConnection();
    console.log("Database connected");
  } catch (err) {
    console.log("Error while connect to database!!!", err);
    throw err;
  }
};

module.exports = { pool, connectToDatabase };
