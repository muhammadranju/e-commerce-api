const router = require("express").Router();
const reviews = require("../../controller/comments.controller/comments.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
router
  .route("/products/:productId/reviews")
  .get(authMiddleware, reviews.getProductReviewsGetController);
router
  .route("/products/:productId/reviews")
  .post(authMiddleware, reviews.createProductReviewsPostController);
router
  .route("/products/:productId/reviews/:reviewId")
  .patch(authMiddleware, reviews.updateProductReviewsPatchController);
router
  .route("/products/:productId/reviews/:reviewId")
  .delete(authMiddleware, reviews.deleteProductReviewsDeleteController);

module.exports = router;
