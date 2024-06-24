const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: order } = require("../../api/v1/order");
const { canPerform, setAbilities } = require("../../middleware/restrictedMode");
const { controller: tracking } = require("../../api/v1/admin/orders");

router
  .route("/view/:orderId")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findSingle
  );
router
  .route("/:orderId")
  .patch(
    authMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    order.update
  );

router
  .route("/:orderId/confirm")
  .delete(
    authMiddleware,
    setAbilities,
    canPerform("delete", "Orders"),
    order.deleteItem
  );

router
  .route("/tracking")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("create", "Orders"),
    tracking.orderTracking
  );
router
  .route("/")
  .post(
    authMiddleware,
    setAbilities,
    canPerform("create", "Orders"),
    order.create
  );

router
  .route("/")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findAll
  );

module.exports = router;
