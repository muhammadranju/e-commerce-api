const router = require("express").Router();

router.route("/checkout").post();
router.route("/checkout/:orderId").get();
router.route("/checkout/:orderId").patch();
router.route("/checkout/:orderId/confirm").post();
router.route("/orders").get();

module.exports = router;
