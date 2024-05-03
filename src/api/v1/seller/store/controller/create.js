const randomstring = require("randomstring");
const slugify = require("slugify");

const Store = require("../../../../../models/Store.model/Store.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");
const Seller = require("../../../../../models/Seller.model/Seller.model");

/**
 * Asynchronously creates a new shop in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the created shop.
 */
const createStore = asyncHandler(async (req, res) => {
  // Destructure the shop data from the request body
  const { storeName, storeDescription, storeAddress, logo, banner } = req.body;

  // Get the sellerId from the request object
  const sellerId = req.seller.sellerId || req.body.sellerId;

  // Find the seller and store in the database
  const [isSeller, isStore] = await Promise.all([
    Seller.findById(sellerId),
    Store.findOne({ sellerId: sellerId }),
  ]);

  // Check if the store already exists in the database
  if (isStore) {
    throw new ApiError(409, "Store already exists");
  }

  // Check if the seller exists in the database
  if (!isSeller) {
    throw new ApiError(404, "Seller not found");
  }

  // Check if all required fields are present in the request body
  if (!storeName || !storeDescription || !storeAddress) {
    throw new ApiError(400, "All fields are required"); // Throw an error if any of the required fields is missing
  }

  // Generate a random URL link for the shop
  const createStoreUrlLink = `${slugify(storeName)}-${randomstring.generate({
    length: 7,
    charset: "alphanumeric",
  })}`;

  // Create a new store object
  const store = new Store({
    storeName,
    storeDescription,
    storeAddress,
    logo,
    banner,
    sellerId: sellerId || isSeller._id,
    storeURI: createStoreUrlLink?.toLowerCase(),
  });

  // Save the store to the database
  await store.save();

  // Return a JSON response with the created store
  return res
    .status(201)
    .json(
      new ApiResponse(201, { content: store }, "Store created successfully")
    );
});

module.exports = createStore;
