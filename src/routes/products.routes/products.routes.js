const router = require("express").Router();

const { controller: product } = require("../../api/v1/product/");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");

// Define validation and sanitization rules

router.route("/").get(product.findAll);
router.route("/").post(sellerAuthMiddleware, product.create);
router.route("/:productId").get(product.findSingle);
router.route("/:productId").patch(sellerAuthMiddleware, product.update);
router.route("/:productId").delete(sellerAuthMiddleware, product.deleteProduct);

module.exports = router;
