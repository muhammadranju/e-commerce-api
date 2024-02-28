const router = require("express").Router();
const reviews = require("../../controller/comments.controller/comments.controller");
router
  .route("/products/:productId/reviews")
  .get(reviews.getProductReviewsGetController);
router
  .route("/products/:productId/reviews")
  .post(reviews.createProductReviewsPostController);
router
  .route("/products/:productId/reviews/:reviewId")
  .patch(reviews.updateProductReviewsPatchController);
router
  .route("/products/:productId/reviews/:reviewId")
  .delete(reviews.deleteProductReviewsDeleteController);

module.exports = router;
