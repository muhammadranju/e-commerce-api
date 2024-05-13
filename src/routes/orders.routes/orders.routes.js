const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");

const { controller: order } = require("../../api/v1/order");

router.route("/orders/").post(authMiddleware, order.create);
router.route("/orders/:orderId").get(authMiddleware, order.findSingle);
router.route("/orders/:orderId").patch(authMiddleware, order.update);

router
  .route("/orders/:orderId/confirm")
  .delete(authMiddleware, order.deleteItem);
router.route("/orders").get(authMiddleware, order.findAll);

module.exports = router;
