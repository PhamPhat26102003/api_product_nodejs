const multer = require("multer");
const path = require("path");
const Product = require("../model/product");

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    return res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving products: ", err: err.message });
  }
};

//Cau hinh luu file anh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

const createNewProduct = async (req, res) => {
  console.log(">>check body: ", req.body);
  try {
    if (!req.body.name || !req.body.price || !req.body.stock_quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { name, description, price, stock_quantity } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stock_quantity),
      image_url,
    };

    const product = await Product.create(productData);
    return res.status(201).json({ product });
  } catch (err) {
    console.error("Error creating product:", err);
    res
      .status(500)
      .json({ message: "Error creating product", err: err.message });
  }
};

const updateProduct = async (req, res) => {};
const deleteProduct = async (req, res) => {};

module.exports = {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  upload,
};
