const Product = require("../../../../models/Products.model/Products.model");
const ApiError = require("../../../../utils/ApiError");
const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const {
    title,
    description,
    short_description,
    regular_price,
    weight,
    dimensions,
    attributes,
    stock_quantity,
    tags,
    category_id,
    brand,
  } = req.body;

  const product = await Product.findOne({ product_uid: productId });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.title = title || product.title;
  product.description = description || product.description;
  product.short_description = short_description || product.short_description;
  product.regular_price = regular_price || product.regular_price;
  product.weight = weight || product.weight;
  product.stock_quantity = stock_quantity || product.stock_quantity;
  product.tags = tags || product.tags;
  product.category_id = category_id || product.category_id;
  product.brand = brand || product.brand;

  // Update dimensions if provided
  if (dimensions) {
    product.dimensions = {
      length: dimensions.length || product.dimensions.length,
      width: dimensions.width || product.dimensions.width,
      height: dimensions.height || product.dimensions.height,
    };
  }

  // // Update attributes
  // product.attributes.map((attribute) => {
  //   const updatedAttribute = attributes.find(
  //     (attr) => attr.id === attribute.id
  //   );
  //   if (updatedAttribute) {
  //     attribute.name = updatedAttribute.name || attribute.name;
  //     attribute.position = updatedAttribute.position || attribute.position;
  //     attribute.visible = updatedAttribute.visible || attribute.visible;
  //     attribute.variation = updatedAttribute.variation || attribute.variation;
  //     attribute.options = updatedAttribute.options || attribute.options;
  //   }
  //   console.log(updatedAttribute);
  // });

  // Update attributes if provided
  if (attributes) {
    product.attributes = product.attributes.map((attribute) => {
      const updatedAttribute = attributes.find(
        (attr) => attr.id === attribute.id
      );
      if (updatedAttribute) {
        return {
          ...attribute,
          name: updatedAttribute.name || attribute.name,
          position: updatedAttribute.position || attribute.position,
          visible: updatedAttribute.visible || attribute.visible,
          variation: updatedAttribute.variation || attribute.variation,
          options: updatedAttribute.options || attribute.options,
        };
      }
      return attribute;
    });
  }

  const host = req.apiHost;

  const links = [
    {
      rel: "self",
      href: `${host}/products/${productId}`,
      method: "GET",
    },
    {
      rel: "create",
      href: `${host}/products`,
      method: "POST",
    },
    {
      rel: "update",
      href: `${host}/products/${productId}`,
      method: "PUT",
    },
    {
      rel: "delete",
      href: `${host}/products/${productId}`,
      method: "DELETE",
    },
    {
      rel: "list",
      href: `${host}/products`,
      method: "GET",
    },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(200, { product, links }, "Product updated successfully")
    );
});
module.exports = updateProduct;
