const router = require("express").Router();

router.route("/products/:productId/reviews").get();
router.route("/products/:productId/reviews").post();
router.route("/products/:productId/reviews/:reviewId").delete();

module.exports = router;
