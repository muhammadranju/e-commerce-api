const Product = require("../../../../models/Products.model/Products.model");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

/**
 * Asynchronously finds all products based on search criteria.
 * If searchBody is present, it searches for products based on that.
 * Otherwise, it searches for products based on search query.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} The JSON response containing the products.
 */
const findProduct = asyncHandler(async (req, res) => {
  // Extract query parameters from request
  let { size = 5, sort, page = 1, search = "" } = req.query || req.body;
  const searchBody = req.body.search;

  // Convert size and page to numbers
  size = +size;
  page = +page;

  // Set default values if not provided
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 5;
  }

  // Calculate skip for pagination
  const skip = (page - 1) * size;

  // Convert search query to lowercase
  search = search?.toLowerCase();

  // Search for products based on searchBody
  if (searchBody) {
    const searchProduct = await Product.find({
      $or: [
        { title: { $regex: searchBody, $options: "i" } },
        { description: { $regex: searchBody, $options: "i" } },
        { tags: { $regex: searchBody, $options: "i" } },
      ],
    })
      .limit(size)
      .skip(skip)
      .sort(sort);

    // Return response with search results
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          productCounts: searchProduct.length,
          searchProduct,
        },
        `Products matching '${searchBody}' found successfully`
      )
    );
  }

  // Search for products based on search query
  const products = await Product.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ],
  })
    .limit(size)
    .skip(skip)
    .sort(sort);
  const productCounts = products.length;

  const host = req.apiHost;
  const links = [
    {
      rel: "self",
      href: `${host}/products?search=${search}&size=${size}&page=${page}&sort=${sort}`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/products`,
      method: "POST",
    },
    {
      rel: "first-page",
      href: `${host}/products?search=${search}&size=${size}&page=1&sort=${sort}`,
      method: "GET",
    },
    {
      rel: "previous-page",
      href: `${host}/products?search=${search}&size=${size}&page=${Math.max(
        page - 1,
        1
      )}&sort=${sort}`,
      method: "GET",
    },
    {
      rel: "next-page",
      href: `${host}/products?search=${search}&size=${size}&page=${
        page + 1
      }&sort=${sort}`,
      method: "GET",
    },
    {
      rel: "last-page",
      href: `${host}/products?search=${search}&size=${size}&page=${Math.ceil(
        productCounts / size
      )}&sort=${sort}`,
      method: "GET",
    },
    {
      rel: "product-details",
      href: `${host}/products/{productId}`,
      method: "GET",
    },
    {
      rel: "update-product",
      href: `${host}/products/{productId}`,
      method: "PUT",
    },
    {
      rel: "delete-product",
      href: `${host}/products/{productId}`,
      method: "DELETE",
    },
  ];

  // Return response with search results
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { productCounts, products, links },
        `Products matching '${searchBody}' found successfully`
      )
    );
});
module.exports = findProduct;
