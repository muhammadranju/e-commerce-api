const router = require("express").Router();

router.route("/").get();
router.route("/add").post();
router.route("/update").patch();
router.route("/remove").delete();
router.route("/clear").delete();

module.exports = router;
