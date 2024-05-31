const router = require("express").Router();
const { controller: product } = require("../../api/v1/product/");
const {
  sellerAuthMiddleware: sellerAuth,
} = require("../../middleware/auth.middleware");
// Define validation and sanitization rules
const { setAbilities, canPerform } = require("../../middleware/restrictedMode");

router.route("/").get(product.findAll);
router.route("/:productId").get(product.findSingle);

router
  .route("/")
  .post(
    sellerAuth,
    setAbilities,
    canPerform("create", "Products"),
    product.create
  );

router
  .route("/:productId")
  .patch(
    sellerAuth,
    setAbilities,
    canPerform("update", "Products"),
    product.update
  );
router
  .route("/:productId")
  .delete(
    sellerAuth,
    setAbilities,
    canPerform("delete", "Products"),
    product.deleteProduct
  );

module.exports = router;
