const router = require("express").Router();

router.route("/payment/generate-token").post();
router.route("/payment/process").post();
router.route("/payment/failed").post();
router.route("/payment/history").get();

module.exports = router;
