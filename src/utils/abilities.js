// Import necessary modules and utilities
const { AbilityBuilder, createMongoAbility } = require("@casl/ability");
const { UserRolesEnum } = require("../constants");

// Define the actions that each role can perform on different resources
const SELLER_CAN = ["Stores", "Products", "Seller"];
const EDITOR_CAN = [
  "Stores",
  "Products",
  "Seller",
  "Brands",
  "Orders",
  "Users",
  "Cart",
  "WishList",
  "Checkout",
  "OrdersItem",
  "CartsItem",
  "Categories",
  "Reviews",
  "Addresses",
];
const USER_CAN = [
  "Orders",
  "Users",
  "Cart",
  "WishList",
  "Checkout",
  "Reviews",
  "Payments",
  "Addresses",
];

/**
 * Defines abilities (permissions) for a given user based on their role.
 *
 * @param {Object} user - The user object containing role and other identifiers.
 * @returns {Object} - The abilities object defining what actions the user can and cannot perform.
 */
function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  // console.log(user);
  // Check the role of the user
  const isAdmin = user.role === UserRolesEnum.ADMIN;
  const isSeller = user.role === UserRolesEnum.SELLER;
  const isEditor = user.role === UserRolesEnum.EDITOR;
  const isUser = user.role === UserRolesEnum.USER;

  // Define abilities based on the user's role
  if (isAdmin) {
    // Admins can manage everything
    can("manage", "all");
  } else if (isEditor) {
    // Editors can read, create, and update but cannot delete the resources listed in EDITOR_CAN
    can("read", EDITOR_CAN);
    can("create", EDITOR_CAN);
    can("update", EDITOR_CAN);
    cannot("delete", EDITOR_CAN);
  } else if (isSeller) {
    // Sellers can read, create, and update their own resources listed in SELLER_CAN
    can("read", SELLER_CAN);
    can("create", SELLER_CAN);
    can("update", SELLER_CAN, { sellerId: user.sellerId }); // can only update their own resources
    // cannot("delete", "Brands");
  } else if (isUser) {
    // Users can read, create, update, and delete their own resources listed in USER_CAN
    can("read", USER_CAN);
    can("create", USER_CAN);
    can("update", USER_CAN, { userId: user.userId }); // can only update their own resources
    can("delete", USER_CAN, { userId: user.userId });
    // cannot("delete", "Brands");
  } else {
    // Guests (or users with undefined roles) can only read resources listed in EDITOR_CAN and SELLER_CAN
    can("read", [EDITOR_CAN, SELLER_CAN]);
  }

  // Build and return the abilities object
  return build();
}

// Export the function to be used in other parts of the application
module.exports = defineAbilitiesFor;
