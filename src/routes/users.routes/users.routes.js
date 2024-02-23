const router = require("express").Router();

router.route("/profile").get();
router.route("/profile").patch();

module.exports = router;
