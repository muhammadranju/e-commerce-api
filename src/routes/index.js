const router = require("express").Router();
const { ApiVersion } = require("../constants");

const userRoute = require("./users.routes/users.routes");
const authRoute = require("./auth.routes/auth.routes");

const productRoute = require("./products.routes/products.routes");
const cartsRoute = require("./carts.routes/carts.routes");
const ordersRoute = require("./comment.routes/comment.routes");

const paymentRoute = require("./payment.route/payment.routes");
const commentsRoute = require("./comment.routes/comment.routes");
const categoriesRoute = require("./category.routes/category.routes");
const wishlistRoute = require("./wishlists.routes/wishlists.routes");

router.use(ApiVersion, userRoute);
router.use(ApiVersion, authRoute);

router.use(ApiVersion, productRoute);
router.use(ApiVersion, cartsRoute);
router.use(ApiVersion, ordersRoute);

router.use(ApiVersion, paymentRoute);
router.use(ApiVersion, commentsRoute);
router.use(ApiVersion, categoriesRoute);
router.use(ApiVersion, wishlistRoute);
module.exports = router;
