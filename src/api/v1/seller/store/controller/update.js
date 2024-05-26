const Store = require("../../../../../models/Store.model/Store.model");
const ApiError = require("../../../../../utils/ApiError");
const ApiResponse = require("../../../../../utils/ApiResponse");
const asyncHandler = require("../../../../../utils/asyncHandler");

const update = asyncHandler(async (req, res) => {
  const { storeName, storeDescription, logo, banner, storeAddress } = req.body;
  const { storeId } = req.params;
  const sellerId = req.seller?.sellerId;

  const findStore = await Store.findOne({
    $or: [{ storeUID: storeId }, { storeURI: storeId }],
  });

  if (!findStore) {
    throw new ApiError(404, "Store not found");
  }

  // Check if the user is authorized to update the review
  if (findStore.sellerId.toString() !== sellerId) {
    throw new ApiError(401, "You are not authorized to update this Store.");
  }

  // Check if all required fields are present in the request body
  findStore.storeName = storeName || findStore.storeName;
  findStore.storeDescription = storeDescription || findStore.storeDescription;
  findStore.logo.url = logo?.url || findStore.logo.url;
  findStore.logo.localPath = logo?.localPath || findStore.logo.localPath;
  findStore.banner.url = banner?.url || findStore.banner.url;
  findStore.banner.localPath = banner?.localPath || findStore.banner.localPath;
  findStore.storeAddress.addressLine =
    storeAddress?.addressLine || findStore.storeAddress.addressLine;
  findStore.storeAddress.street =
    storeAddress?.street || findStore.storeAddress.street;
  findStore.storeAddress.city =
    storeAddress?.city || findStore.storeAddress.city;
  findStore.storeAddress.state =
    storeAddress?.state || findStore.storeAddress.state;
  findStore.storeAddress.country =
    storeAddress?.country || findStore.storeAddress.country;
  findStore.storeAddress.postalCode =
    storeAddress?.postalCode || findStore.storeAddress.postalCode;

  await findStore.save();

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
      description: "Get details of the deleted store",
    },
    {
      rel: "create-store",
      href: `${host}/seller/stores`,
      method: "POST",
      description: "Create a new store",
    },
    // {
    //   rel: "list-stores",
    //   href: `${host}/seller/stores`,
    //   method: "GET",
    //   description: "List all stores",
    // },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(200, { findStore, links }, "Store updated successfully")
    );
});

module.exports = update;
