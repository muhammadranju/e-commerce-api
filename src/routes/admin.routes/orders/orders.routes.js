const { sellerAuthMiddleware } = require("../../../middleware/auth.middleware");
const { controller: order } = require("../../../api/v1/admin/orders");

const {
  setAbilities,
  canPerform,
} = require("../../../middleware/restrictedMode");
const router = require("express").Router();

router
  .route("/orders/:orderId")
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findSingle
  );

router
  .route("/orders/:orderId")
  .patch(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    order.update
  );

router
  .route("/orders")
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    order.findAll
  );
module.exports = router;
