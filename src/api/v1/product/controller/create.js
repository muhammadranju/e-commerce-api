const { baseURI } = require("../../../../constants");
const Product = require("../../../../models/Products.model/Products.model");
const Seller = require("../../../../models/Seller.model/Seller.model");
const Store = require("../../../../models/Store.model/Store.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Asynchronously creates a new product in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the created product.
 */
const productCreateController = asyncHandler(async (req, res) => {
  const {
    store_Id,
    title,
    description,
    short_description,
    featured,
    regular_price,
    weight,
    stock_quantity,
    tags,
    cover_image,
    images,
    attributes,
    dimensions,
    category_id,
    brand,
  } = req.body;

  const { sellerId } = req.seller;

  // Validate that the 'store_Id' field is present in the request body
  if (
    !store_Id ||
    !sellerId ||
    !title ||
    !description ||
    !short_description ||
    !regular_price ||
    !weight ||
    !stock_quantity ||
    !tags ||
    !cover_image ||
    !images ||
    !attributes ||
    !dimensions ||
    !category_id ||
    !brand
  ) {
    throw new ApiError(400, "All required fields are missing");
  }

  // Find the seller and store in the database
  const [isSeller, isStore] = await Promise.all([
    Seller.findById(sellerId),
    Store.findById(store_Id),
  ]);

  // check seller and store is exists or not
  if (!isSeller) {
    throw new ApiError(404, "Seller not found");
  }
  if (!isStore) {
    throw new ApiError(404, "Shop not found");
  }
  if (isStore?.sellerId.toString() !== isSeller?._id.toString()) {
    throw new ApiError(403, "Seller is not the owner of the store");
  }

  // Create a new product object using the data from the request body
  const product = new Product({
    title,
    description,
    short_description,
    featured,
    regular_price,
    weight,
    stock_quantity,
    tags,
    cover_image,
    images,
    attributes,
    dimensions,
    category_id,
    brand,
    store_Id,
    seller_Id: isSeller._id,
  });

  // Save the product to the database
  await product.save();

  // Return the response with the created product and relevant links
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        product,
        links: {
          self: `${baseURI}/product/${product?.slug}`,
          next: `${baseURI}/products`,
        },
      },
      "Product created successfully"
    )
  );
});

module.exports = productCreateController;
