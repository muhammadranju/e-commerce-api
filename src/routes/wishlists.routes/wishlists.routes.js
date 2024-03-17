const router = require("express").Router();

router.route("/").get();
router.route("/add").post();
router.route("/remove").delete();

module.exports = router;
