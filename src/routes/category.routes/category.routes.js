const router = require("express").Router();

router.route("/categories").get();
router.route("/categories/:categoryId").get();
router.route("/categories").post();
router.route("/categories/:categoryId").patch();
router.route("/categories/:categoryId").delete();

module.exports = router;
