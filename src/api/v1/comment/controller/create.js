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

    return res
      .status(201)
      .json(new ApiResponse(201, { comment }, "Comment created successfully."));
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsCreateController;
