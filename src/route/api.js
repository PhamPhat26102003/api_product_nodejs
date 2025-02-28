const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require("../controller/productController");

const {
  getCart,
  addToCart,
  updateCart,
  checkout,
} = require("../controller/cartController");

router.get("/", getAllProduct);
router.post("/create", upload.single("image_url"), createNewProduct);
router.put("/update/:id", upload.single("image_url"), updateProduct);
router.delete("/delete/:id", deleteProduct);

//Hien thi gio hang cua user
router.get("/cart/:userId", getCart);
//Them san pham vao gio hang
router.post("/cart/add-to-cart", addToCart);
//Cap nhat san pham trong gio hang
router.put("/cart/update", updateCart);
//Mua san pham
router.post("/cart/checkout", checkout);

module.exports = router;
