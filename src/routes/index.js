const router = require("express").Router();
const { ApiVersion } = require("../constants");

const addressRoutes = require("./address.routes/address.routes");

const userRoutes = require("./users.routes/users.routes");
const authRoutes = require("./auth.routes/auth.routes");

const productRoutes = require("./products.routes/products.routes");
const cartsRoutes = require("./carts.routes/carts.routes");

const ordersRoutes = require("./orders.routes/orders.routes");
const paymentRoutes = require("./payment.route/payment.routes");

const categoriesRoutes = require("./category.routes/category.routes");
const brandRoutes = require("./brand.routes/brand.routes");

const reviewsRoutes = require("./reviews.routes/reviews.routes");
const wishlistRoutes = require("./wishlists.routes/wishlists.routes");

// import seller routers
const sellerRoutes = require("./seller.routes/seller.routes");
const storeRoutes = require("./store.routes/store.routes");

// this routes only for admins
const admin = require("./admin.routes/auth/register.routes");
// this routes is checking api health
router.get(`${ApiVersion}/health`, (req, res) =>
  res.json({ message: "Server is healthy😀" })
);

router.use("/users", [userRoutes, reviewsRoutes, addressRoutes]);
router.use("/auth", authRoutes);
router.use("/carts", cartsRoutes);
router.use("/checkout", ordersRoutes);
router.use("/payment", paymentRoutes);
router.use("/categories", categoriesRoutes);
router.use("/brands", brandRoutes);
router.use("/wishlists", wishlistRoutes);
router.use("/products", productRoutes);
// defined a seller routers
router.use("/seller", [sellerRoutes, storeRoutes]);
router.use("/admins", admin);

module.exports = router;
