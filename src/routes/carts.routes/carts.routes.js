const router = require("express").Router();

router.route("/cart").get();
router.route("/cart/add").post();
router.route("/cart/update").patch();
router.route("/cart/remove").delete();
router.route("/cart/clear").delete();

module.exports = router;
