const router = require("express").Router();
// const reviews = require("../../controller/comments.controller/comments.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");

const { controller: reviews } = require("../../api/v1/comment");
router.route("/:productId/reviews").get(authMiddleware, reviews.findSingle);
router.route("/:productId/reviews").post(authMiddleware, reviews.create);
router
  .route("/:productId/reviews/:reviewId")
  .patch(authMiddleware, reviews.update);
router
  .route("/:productId/reviews/:reviewId")
  .delete(authMiddleware, reviews.deleteComment);

module.exports = router;
