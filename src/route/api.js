const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require("../controller/productController");

router.get("/", getAllProduct);
router.post("/create", upload.single("image_url"), createNewProduct);
router.put("/update/:id", upload.single("image_url"), updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
