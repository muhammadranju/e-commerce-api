const router = require("express").Router();

const { controller: productController } = require("../../api/v1/product/");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");

// Define validation and sanitization rules

router.route("/").get(sellerAuthMiddleware, productController.findAll);
router.route("/").post(sellerAuthMiddleware, productController.create);
router.route("/:productId").get(productController.findSingle);
router
  .route("/:productId")
  .patch(sellerAuthMiddleware, productController.update);
router
  .route("/:productId")
  .delete(sellerAuthMiddleware, productController.deleteProduct);

module.exports = router;
