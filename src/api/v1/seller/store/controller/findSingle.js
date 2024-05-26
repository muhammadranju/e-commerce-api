const Store = require("../../../../../models/Store.model/Store.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const findSingle = asyncHandler(async (req, res) => {
  // Destructure the storeId from the request parameters object
  const { storeId } = req.params;

  // Find the store in the database using the storeId
  const findStore = await Store.findOne({
    $or: [{ storeUID: storeId }, { storeURI: storeId }],
  });

  // Check if the store exists in the database and throw an error if it doesn't exist
  if (!findStore) {
    throw new ApiError(404, "Store not found");
  }

  const host = req.apiHost;

  // HATEOAS links
  const links = [
    {
      rel: "self",
      href: [
        `${host}/seller/stores/${findStore.storeURI}`,
        `${host}/seller/stores/${findStore.storeUID}`,
      ],
      method: "GET",
      description: "Get details of the found store",
    },
    {
      rel: "update-store",
      href: [
        `${host}/seller/stores/${findStore.storeURI}`,
        `${host}/seller/stores/${findStore.storeUID}`,
      ],

      method: "PUT",
      description: "Update this store",
    },
    {
      rel: "delete-store",
      href: [
        `${host}/seller/stores/${findStore.storeURI}`,
        `${host}/seller/stores/${findStore.storeUID}`,
      ],
      method: "DELETE",
      description: "Delete this store",
    },
  ];

  // Return the store as a JSON response with a 200 status code (OK) and a success message
  return res
    .status(200)
    .json(
      new ApiResponse(200, { findStore, links }, "Store found successfully")
    );
});

module.exports = findSingle;
