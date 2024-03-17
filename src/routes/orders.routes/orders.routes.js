const router = require("express").Router();

router.route("/").post();
router.route("/:orderId").get();
router.route("/:orderId").patch();
router.route("/:orderId/confirm").post();
router.route("/orders").get();

module.exports = router;
