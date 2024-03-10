const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const Comment = require('../../models/Comment.model/Comment.model');
const ApiResponse = require("../../utils/ApiResponse");

const getProductReviewsGetController = asyncHandler(async (req, res, next) => {
  // check the productId from database is exits or not
  
    const comment=await Comment.find()
  // get one review by id from params productId
  // if all ok then return data as a json formate

  try {
  } catch (error) {
    next(error);
  }
});

const createProductReviewsPostController = asyncHandler(
  async (req, res, next) => {
    try {
      // get all data from req,body or frontend (content, author, product, rating)
      const { content, product, rating } = req.body

      // check data is valid or not
      if (!content, !product, !rating) {
        throw new ApiError(400, "All fields are required.")
      }
      // if all data is valid then create a new Object model for database
      const comment = new Comment({
        content,
        product,
        rating,
        author: req.user.userId
      })

      // then save the data in to database

      return res.status(201).json(
        new ApiResponse(201, { comment }, 'Comment created successfully.')
      )
    } catch (error) {
      next(error);
    }
  }
);

const updateProductReviewsPatchController = asyncHandler(
  async (req, res, next) => {
    try {
      // get productId and reviewId from params
      // check id's from database are id's valid or not
      // if all ok then get data from req.body or frontend
      // then save in to database
    } catch (error) {
      next(error);
    }
  }
);
const deleteProductReviewsDeleteController = asyncHandler(
  async (req, res, next) => {
    try {
      // get productId and reviewId from params
      // check id's from database are id's valid or not
      // if ok then delete from database reviewsId
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  getProductReviewsGetController,
  createProductReviewsPostController,
  updateProductReviewsPatchController,
  deleteProductReviewsDeleteController,
};
