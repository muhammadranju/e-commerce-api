const router = require("express").Router();
const { ApiVersion } = require("../constants");

const userRoutes = require("./users.routes/users.routes");
const authRoutes = require("./auth.routes/auth.routes");

const productRoutes = require("./products.routes/products.routes");
const cartsRoutes = require("./carts.routes/carts.routes");

const ordersRoutes = require("./orders.routes/orders.routes");
const paymentRoutes = require("./payment.route/payment.routes");

const categoriesRoutes = require("./category.routes/category.routes");
const brandRoutes = require("./brand.routes/brand.routes");

const commentsRoutes = require("./comment.routes/comment.routes");
const wishlistRoutes = require("./wishlists.routes/wishlists.routes");

// seller routers
const sellerRoutes = require("./seller.routes/seller.routes");

router.get(`${ApiVersion}/health`, (req, res) =>
  res.json({ message: "Server is healthy😀" })
);

router.use(ApiVersion, userRoutes);
router.use(ApiVersion, authRoutes);

router.use(ApiVersion, productRoutes);
router.use(ApiVersion, cartsRoutes);

router.use(ApiVersion, categoriesRoutes);
router.use(ApiVersion, brandRoutes);

router.use(ApiVersion, ordersRoutes);
router.use(ApiVersion, paymentRoutes);

router.use(ApiVersion, commentsRoutes);
router.use(ApiVersion, wishlistRoutes);

// seller routes
router.use(ApiVersion, sellerRoutes);

module.exports = router;
