const router = require("express").Router();

router.route("/").get();
router.route("/").post();
router.route("/:productId").get();
router.route("/:productId").patch();
router.route("/:productId").delete();

module.exports = router;
