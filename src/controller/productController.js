const { findAll, create, update } = require("../db/queries");
const multer = require("multer");
const path = require("path");

const getAllProduct = async (req, res) => {
  try {
    const product = await findAll();
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error!!" });
  }
};

//Cau hinh luu file anh
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const createNewProduct = async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const productData = { name, description, price, stock_quantity, image_url };
  try {
    const product = await create(productData);
    return res.status(201).json({ product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error!!" });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params;
  const { name, description, price, stock_quantity } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const productData = { name, description, price, stock_quantity, image_url };
  try {
    const product = await update(id, productData);
    return res.status(201).json({ message: "Update product success", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error!!" });
  }
};
const deleteProduct = async (req, res) => {};

module.exports = {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  upload,
};
