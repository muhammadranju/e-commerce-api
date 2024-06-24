const router = require("express").Router();
const { controller: payment } = require("../../api/v1/payment");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { setAbilities, canPerform } = require("../../middleware/restrictedMode");

router
  .route("/place/:paymentId")
  .post(
    authMiddleware,
    setAbilities,
    canPerform("create", "Payments"),
    payment.create
  );

router.route("/success").post(payment.success);
router.route("/cancel").post(payment.cancel);
router.route("/failed").post(payment.failed);
router.route("/ipn").post(payment.ipn);

module.exports = router;
