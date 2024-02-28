const asyncHandler = require("../../utils/asyncHandler");

const getProductReviewsGetController = asyncHandler(async (req, res, next) => {
  // check the productId from database is exits or not
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
      // check data is valid or not
      // if all data is valid then create a new Object model for database
      // then save the data in to database
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
