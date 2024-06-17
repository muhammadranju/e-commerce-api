const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: order } = require("../../api/v1/order");
const { canPerform, setAbilities } = require("../../middleware/restrictedMode");

router
  .route("/orders/")
  .post(
    authMiddleware,
    setAbilities,
    canPerform("create", "Orders"),
    order.create
  );
router
  .route("/orders/:orderId")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findSingle
  );
router
  .route("/orders/:orderId")
  .patch(
    authMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    order.update
  );

router
  .route("/orders/:orderId/confirm")
  .delete(
    authMiddleware,
    setAbilities,
    canPerform("delete", "Orders"),
    order.deleteItem
  );
router
  .route("/orders")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findAll
  );

module.exports = router;
