const router = require("express").Router();
const { controller: product } = require("../../api/v1/product/");
const { UserRolesEnum } = require("../../constants");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");
// Define validation and sanitization rules
const restricted = require("../../middleware/restricted.middleware");
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.SELLER
);
router.route("/").get(product.findAll);
router.route("/").post(sellerAuthMiddleware, restrictedArray, product.create);
router.route("/:productId").get(product.findSingle);
router
  .route("/:productId")
  .patch(sellerAuthMiddleware, restrictedArray, product.update);
router
  .route("/:productId")
  .delete(sellerAuthMiddleware, restrictedArray, product.deleteProduct);

module.exports = router;
