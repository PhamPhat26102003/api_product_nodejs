const Product = require("../model/product");
const User = require("../model/user");
const Cart = require("../model/cart");
const CartItem = require("../model/cartItem");
const Order = require("../model/order");
const OrderItem = require("../model/orderItem");

//Hien thi gio hang
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    //Kiem tra user co ton tai khong
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Kiem tra gio hang cua user
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }

    //Lay danh sach san pham trong gio hang
    const cartItem = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "image_url"],
        },
      ],
    });

    return res.status(200).json({ cartItem });
  } catch (err) {
    console.error("Error while finding cart:", err);
    res
      .status(500)
      .json({ message: "Error while finding cart", error: err.message });
  }
};

//Them san pham vao gio hang
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Kiểm tra user có tồn tại không
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        message: `Not enough stock available. Only ${product.stock_quantity} left`,
      });
    }

    // Kiểm tra giỏ hàng của user
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (cartItem) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });
    }

    return res
      .status(201)
      .json({ message: "Added to cart successfully", cartItem });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
};

//Cap nhat gio hang
const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    //Kiem tra gio hang cua user
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!!" });
    }

    //Kiem tra san pham co ton tai ko
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!!" });
    }

    //Kiem tra san pham co trong gio hang chua
    const cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart!!" });
    }

    //Neu so luong <= 0 xoa khoi gio hang
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.status(200).json({ message: "Product removed from cart!!" });
    }

    //Cap nhat so luong trong gio hang
    cartItem.quantity = quantity;
    await cartItem.save();

    return res
      .status(200)
      .json({ message: "Update cart successfully", cartItem });
  } catch (err) {
    console.error("Error updating cart:", err);
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};

//Mua san pham
const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    //Kiem tra user xem co ton tai
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Lay gio hang cua user
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty!!" });
    }

    //Lay danh sach san pham trong gio hang
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product }],
    });

    if (cartItems.length === 0) {
      return res.status(200).json({ message: "Cart is empty!!" });
    }

    let totalAmount = 0;
    let orderItems = [];

    //Kiem tra va cap nhat so luong san pham
    for (let cartItem of cartItems) {
      const product = cartItem.Product;

      if (product.stock_quantity < cartItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Only ${product.stock_quantity} left.`,
        });
      }

      //Tru so luong san pham trong kho
      product.stock_quantity -= cartItem.quantity;
      await product.save();

      //Tinh tong tien don hang
      totalAmount += product.price * cartItem.quantity;

      //Them vao danh sach don hang
      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    //Tao don hang
    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
    });

    //Tao chi tiet don hang
    for (let item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    //Xoa san pham khoi gio hang
    await CartItem.destroy({
      where: { cart_id: cart.id },
    });

    return res.status(200).json({ message: "Order product success", order });
  } catch (err) {
    console.error("Error during checkout", err);
    res
      .status(500)
      .json({ message: "Error during checkout", error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCart, checkout };
