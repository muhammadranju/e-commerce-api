const router = require("express").Router();

router.route("/products").get();
router.route("/products/:productId").get();
router.route("/products").post();
router.route("/products/:productId").patch();
router.route("/products/:productId").delete();

module.exports = router;
