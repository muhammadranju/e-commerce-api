const router = require("express").Router();

router.route("/generate-token").post();
router.route("/process").post();
router.route("/failed").post();
router.route("/history").get();

module.exports = router;
