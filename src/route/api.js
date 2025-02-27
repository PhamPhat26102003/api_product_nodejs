const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  upload,
} = require("../controller/productController");

router.get("/", getAllProduct);
router.post("/create", upload.single("image_url"), createNewProduct);
router.put("/update/:id", upload.single("image_url"), updateProduct);
router.delete("/delete/:id", deleteProduct);

//Them san pham vao gio hang
router.post("/add-to-cart", addToCart);

module.exports = router;
