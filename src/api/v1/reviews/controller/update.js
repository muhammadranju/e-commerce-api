const asyncHandler = require("../../../../utils/asyncHandler");

const reviewsUpdateController = asyncHandler(async (req, res, next) => {
  try {
    // get productId and reviewId from params
    // check id's from database are id's valid or not
    // if all ok then get data from req.body or frontend
    // then save in to database
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsUpdateController;
