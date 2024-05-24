const asyncHandler = require("../../../../utils/asyncHandler");

const reviewsDeleteController = asyncHandler(async (req, res, next) => {
  try {
    // get productId and reviewId from params
    // check id's from database are id's valid or not
    // if ok then delete from database reviewsId
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsDeleteController;
