const multer = require("multer");
const path = require("path");
const Product = require("../model/product");

//Lay tat ca ban ghi
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

//Lay 1 ban ghi
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product id not found" });
    }
    return res.status(200).json(product);
  } catch (err) {}
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

//Tao moi ban ghi
const createNewProduct = async (req, res) => {
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

//Cap nhat ban ghi
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    //Kiem tra san pham co ton tai
    const productId = await Product.findByPk(id);
    if (!productId) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productData = {};

    //validate
    if (name) productData.name = name;
    if (description) productData.description = description;
    if (price) productData.price = price;
    if (stock_quantity) productData.stock_quantity = stock_quantity;
    if (image_url) productData.image_url = image_url;

    //Kiem tra cac truong cap nhat
    if (Object.keys(productData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    //Cap nhat san pham
    const product = await Product.update(productData, { where: { id } });

    // Lấy lại sản phẩm đã cập nhật
    const updatedProduct = await Product.findByPk(id);
    return res
      .status(201)
      .json({ message: "Update product success", product: updatedProduct });
  } catch (err) {
    console.error("Error update product:", err);
    res.status(500).json({ message: "Error update product", err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing product id" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.destroy({ where: { id } });
    return res.status(200).json({ message: "Delete product success" });
  } catch (err) {
    console.error("Error delete product:", err);
    res.status(500).json({ message: "Error delete product", err: err.message });
  }
};

module.exports = {
  getAllProduct,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  upload,
};
