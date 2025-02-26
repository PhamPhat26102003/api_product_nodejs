const { findAll } = require("../db/queries");

const getAllProduct = async (req, res) => {
  try {
    const product = await findAll();
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Error!!" });
  }
};
const createNewProduct = async (req, res) => {};
const updateProduct = async (req, res) => {};
const deleteProduct = async (req, res) => {};

module.exports = {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
