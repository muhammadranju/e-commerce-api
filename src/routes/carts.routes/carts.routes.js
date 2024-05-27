const router = require("express").Router();
const { controller: cart } = require("../../api/v1/cart");
const { UserRolesEnum } = require("../../constants");
const { authMiddleware } = require("../../middleware/auth.middleware");
const restricted = require("../../middleware/restricted.middleware");
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router.route("/").get(authMiddleware, restrictedArray, cart.findAll);
router.route("/").post(authMiddleware, restrictedArray, cart.create);
router.route("/:productId").patch(authMiddleware, restrictedArray, cart.update);
router
  .route("/:productId")
  .delete(authMiddleware, restrictedArray, cart.deleteItem);
router.route("/empty").delete(authMiddleware, restrictedArray, cart.deleteAll);

module.exports = router;
