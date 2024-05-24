const mongoose = require("mongoose");
const Comment = require("../../../../models/Reviews.model/Reviews.model.js");
const ApiError = require("../../../../utils/ApiError.js");
const ApiResponse = require("../../../../utils/ApiResponse.js");
const asyncHandler = require("../../../../utils/asyncHandler.js");
const Product = require("../../../../models/Products.model/Products.model.js");
const StoreComments = require("../../../../models/Reviews.model/StoreReviews.js");
const reviewsCreateController = asyncHandler(async (req, res, next) => {
  try {
    // get all data from req,body or frontend (content, author, product, rating)
    const { content, products: productId, rating } = req.body;
    const userId = req.user?.userId;

    // check data is valid or not
    if ((!content, !productId, !rating)) {
      throw new ApiError(400, "All fields are required.");
    }

    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        400,
        "Invalid product id. Please provide a valid product id."
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    let findStoreComment = await StoreComments.findOne({
      productId,
    });

    // if all data is valid then create a new Object model for database
    const comment = new Comment({
      content,
      products: product._id,
      rating,
      author: userId,
    });

    if (!findStoreComment) {
      findStoreComment = new StoreComments({
        productId: product._id,
        comments: [],
      });
    }

    findStoreComment.comments.push(comment._id);
    // then save the data in to database
    product.comments = findStoreComment._id;
    await findStoreComment.save();
    await comment.save();
    await product.save();

    // get the host from req.apiHost
    const host = req.apiHost;
    // create HATEOAS links for the response
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
