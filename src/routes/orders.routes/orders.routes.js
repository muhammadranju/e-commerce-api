const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: order } = require("../../api/v1/order");
const restricted = require("../../middleware/restricted.middleware");
const { UserRolesEnum } = require("../../constants");
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);

router.route("/orders/").post(authMiddleware, restrictedArray, order.create);
router
  .route("/orders/:orderId")
  .get(authMiddleware, restrictedArray, order.findSingle);
router
  .route("/orders/:orderId")
  .patch(authMiddleware, restrictedArray, order.update);

router
  .route("/orders/:orderId/confirm")
  .delete(authMiddleware, restrictedArray, order.deleteItem);
router.route("/orders").get(authMiddleware, restrictedArray, order.findAll);

module.exports = router;
