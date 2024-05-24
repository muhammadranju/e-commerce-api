const Comment = require("../../../../models/Comment.model/Comment.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const reviewsCreateController = asyncHandler(async (req, res, next) => {
  try {
    // get all data from req,body or frontend (content, author, product, rating)
    const { content, product, rating } = req.body;

    // check data is valid or not
    if ((!content, !product, !rating)) {
      throw new ApiError(400, "All fields are required.");
    }
    // if all data is valid then create a new Object model for database
    const comment = new Comment({
      content,
      product,
      rating,
      author: req.user.userId,
    });

    // then save the data in to database
    await comment.save();

    const host = req.apiHost;
    const links = [
      {
        rel: "self",
        href: `${host}/products/${comment._id}`,
        method: "GET",
        description: "Retrieve the created comment",
      },
      {
        rel: "update_review",
        href: `${host}/products/${comment._id}`,
        method: "PUT",
        description: "Update the created comment",
      },
      {
        rel: "delete_review",
        href: `${host}/products/${comment._id}`,
        method: "DELETE",
        description: "Delete the created comment",
      },
      {
        rel: "product_reviews",
        href: `${host}/products/${comment.product}/reviews`,
        method: "GET",
        description: "Get all reviews for the product",
      },
    ];
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { comment, links },
          "Comment created successfully."
        )
      );
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsCreateController;
