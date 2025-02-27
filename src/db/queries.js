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

const create = async (product) => {
  const field = Object.keys(product).join(", ");
  const placeholder = Object.keys(product)
    .map(() => "?")
    .join(", ");
  const values = Object.values(product);

  const queryString = `INSERT INTO product (${field}) VALUES (${placeholder})`;

  try {
    const client = await pool.getConnection();
    const result = await client.query(queryString, values);
    return result[0];
  } catch (err) {
    console.log("Error while create record: ", err);
    throw err;
  }
};

const update = async (id, product) => {
  if (!id) {
    throw new Error("Missing id for update!!");
  }

  // Nếu không có trường nào cần cập nhật thì trả về lỗi
  if (Object.keys(product).length === 0) {
    throw new Error("No fields to update");
  }

  const fields = Object.keys(product)
    .map((key) => `\`${key}\` = ?`) // Thêm backtick ` để tránh lỗi tên cột
    .join(", ");
  const values = [...Object.values(product), id]; // Thêm id vào cuối để dùng trong WHERE

  const queryString = `UPDATE product SET ${fields} WHERE id = ?`;

  try {
    const result = await pool.query(queryString, values);
    return result;
  } catch (err) {
    console.error("Error while updating product: ", err);
    throw err;
  }
};

module.exports = {
  findAll,
  create,
  update,
};
