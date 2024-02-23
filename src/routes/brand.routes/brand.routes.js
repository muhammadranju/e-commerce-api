const router = require("express").Router();

router.route("/brand").get();
router.route("/brand").post();
router.route("/brand/:brandId").patch();
router.route("/brand/:brandId").delete();

module.exports = router;
