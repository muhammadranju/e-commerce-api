const Comment = require("../../../../models/Comment.model/Comment.model");
const asyncHandler = require("../../../../utils/asyncHandler");

const reviewsGetController = asyncHandler(async (req, res, next) => {
  // check the productId from database is exits or not

  const comment = await Comment.find();
  // get one review by id from params productId
  // if all ok then return data as a json formate

  try {
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsGetController;
