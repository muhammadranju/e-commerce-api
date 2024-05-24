const router = require("express").Router();
// const reviews = require("../../controller/comments.controller/comments.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const { controller: reviews } = require("../../api/v1/reviews");

router.route("/reviews").post(authMiddleware, reviews.create);
router.route("/reviews").patch(authMiddleware, reviews.update);

module.exports = router;
