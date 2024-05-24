const router = require("express").Router();
// const reviews = require("../../controller/comments.controller/comments.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const { controller: reviews } = require("../../api/v1/reviews");
// router
//   .route("/comments/:productId/reviews")
//   .get(authMiddleware, reviews.findAll);

router.route("/reviews").post(authMiddleware, reviews.create);

router.route("/reviews/:reviewId").patch(authMiddleware, reviews.update);

// router
//   .route("/comments/:productId/reviews/:reviewId")
//   .delete(authMiddleware, reviews.deleteComment);

module.exports = router;
