const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

router.get("/", getAllProduct);
router.post("/create", createNewProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
