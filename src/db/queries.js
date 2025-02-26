const { pool } = require("../db/connect");

const findAll = async () => {
  const queryString = "SELECT * FROM product";

  try {
    const client = await pool.getConnection();
    const result = await client.query(queryString);
    return result[0];
  } catch (err) {
    console.log("Error while finding record: ", err);
    throw err;
  }
};

module.exports = {
  findAll,
};
