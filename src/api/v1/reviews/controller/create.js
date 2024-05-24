const Product = require("../../../../models/Products.model/Products.model");
const Comment = require("../../../../models/Reviews.model/Reviews.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const reviewsCreateController = asyncHandler(async (req, res) => {
  // get all data from req,body or frontend (content, author, product, rating)
  let { content, productId, rating, serviceRating } = req.body;
  const userId = req.user?.userId;

  // check data is valid or not
  if ((!content, !productId, !rating)) {
    throw new ApiError(400, "All fields are required.");
  }

  // convert rating and serviceRating to number
  rating = Number(rating);
  serviceRating = Number(serviceRating);

  // check if the product is exist or not
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // if all data is valid then create a new Object model for database
  const reviews = new Comment({
    content,
    products: productId,
    rating,
    serviceRating,
    userId,
  });

  // then save the data in to database
  product.reviews.push(reviews._id);
  await product.save();
  await reviews.save();

  const host = req.apiHost;
  const links = [
    {
      rel: "self",
      href: `${host}/users/reviews/`,
      method: "GET",
      description: "Retrieve the created reviews",
    },
    {
      rel: "update_review",
      href: `${host}/users/reviews/${reviews._id}`,
      method: "PUT",
      description: "Update the created reviews",
    },

    {
      rel: "product_reviews",
      href: `${host}/products/${product.slug}?reviews=true`,
      method: "GET",
      description: "Get all reviews for the product",
    },
  ];
  // return the data to frontend in json format with status 201 and success message
  return res
    .status(201)
    .json(
      new ApiResponse(201, { reviews, links }, "Comment created successfully.")
    );
});

module.exports = reviewsCreateController;
