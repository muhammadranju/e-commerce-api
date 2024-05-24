// Import necessary modules and utilities
const Product = require("../../../../models/Products.model/Products.model");
const Reviews = require("../../../../models/Reviews.model/Reviews.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

// Controller to handle updating a review
const reviewsUpdateController = asyncHandler(async (req, res) => {
  // Get data from the request body
  let { content, reviewId, rating, serviceRating } = req.body;
  // Extract user ID from the request object
  const userId = req.user?.userId;

  // Validate that all required fields are present
  if ((!content, !reviewId, !rating)) {
    throw new ApiError(400, "All fields are required.");
  }

  // Convert rating and serviceRating to numbers
  rating = Number(rating);
  serviceRating = Number(serviceRating);

  // Find the review by ID
  const reviews = await Reviews.findById(reviewId);

  // Find the product associated with the review
  const product = await Product.findById(reviews.products);

  // Check if the product exists
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if the review exists
  if (!reviews) {
    throw new ApiError(404, "Review not found.");
  }

  // Check if the user is authorized to update the review
  if (reviews.userId.toString() !== userId) {
    throw new ApiError(401, "You are not authorized to update this review.");
  }

  // Validate that ratings are between 1 and 5
  if (rating > 5 || rating < 1 || serviceRating > 5 || serviceRating < 1) {
    throw new ApiError(
      400,
      "Rating or Service rating must be between 1 and 5."
    );
  }

  // Update the review fields
  reviews.content = content || reviews.content;
  reviews.rating = rating || reviews.rating;
  reviews.serviceRating = serviceRating || reviews.serviceRating;
  // Save the updated review to the database
  // await reviews.save();

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: `${host}/users/reviews/`,
      method: "GET",
      description: "Get details of the updated review",
    },
    {
      rel: "update-review",
      href: `${host}/reviews/update/`,
      method: "PUT",
      description: "Update this review",
    },
    {
      rel: "product-details",
      href: `${host}/products/${product?.slug}`,
      method: "GET",
      description: "View the product associated with this review",
    },
  ];

  // Return a success response with the updated review
  return res
    .status(200)
    .json(
      new ApiResponse(200, { reviews, links }, "Review updated successfully")
    );
});

// Export the controller to be used in other parts of the application
module.exports = reviewsUpdateController;
