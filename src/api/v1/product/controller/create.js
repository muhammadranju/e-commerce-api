const Product = require("../../../../models/Products.model/Products.model");
const Seller = require("../../../../models/Seller.model/Seller.model");
const Store = require("../../../../models/Store.model/Store.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Validates the required fields for creating a product.
 * @param {Object} body The request body.
 */
function validateProductFields(body) {
  const requiredFields = [
    "store_Id",
    "title",
    "description",
    "short_description",
    "regular_price",
    "weight",
    "stock_quantity",
    "tags",
    "cover_image",
    "images",
    "attributes",
    "dimensions",
    "category_id",
    "brand",
  ];

  const missingFields = requiredFields.filter((field) => !body[field]);
  if (missingFields.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }
}

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
  validateProductFields(req.body);

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
  const [seller, store] = await Promise.all([
    Seller.findById(sellerId),
    Store.findById(store_Id),
  ]);

  // check seller and store is exists or not
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }
  if (!store) {
    throw new ApiError(404, "Shop not found");
  }
  if (store?.sellerId.toString() !== seller?._id.toString()) {
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
    seller_Id: seller._id,
  });

  // Save the product to the database
  await product.save();

  const host = req.apiHost;

  const links = [
    {
      rel: "self",
      href: `${host}/products/${product?.slug}`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/products`,
      method: "POST",
    },
    {
      rel: "update",
      href: `${host}/products/${product?.slug}`,
      method: "PUT",
    },
    {
      rel: "delete",
      href: `${host}/products/${product?.slug}`,
      method: "DELETE",
    },
    {
      rel: "all-products",
      href: `${host}/products`,
      method: "GET",
    },
  ];

  // Return the response with the created product and relevant links
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        product,
        links,
      },
      "Product created successfully"
    )
  );
});

module.exports = productCreateController;
