// Import necessary modules and utilities
const router = require("express").Router();
const { controller: category } = require("../../api/v1/category");
const { setAbilities, canPerform } = require("../../middleware/restrictedMode");
const {
  sellerAuthMiddleware: adminAuth,
} = require("../../middleware/auth.middleware");

// Define routes for category operations

// Route to get a single category by its ID
router.route("/:categoryId").get(category.findSingle);

// Route to get all categories
router.route("/").get(category.findAll);

// Route to create a new category
// Requires admin authentication, sets abilities, and checks if the user can perform the 'create' action on 'Categories'
router
  .route("/")
  .post(
    adminAuth,
    setAbilities,
    canPerform("create", "Categories"),
    category.create
  );

// Route to update an existing category by its ID
// Requires admin authentication, sets abilities, and checks if the user can perform the 'update' action on 'Categories'
router
  .route("/:categoryId")
  .patch(
    adminAuth,
    setAbilities,
    canPerform("update", "Categories"),
    category.update
  );

// Route to delete a category by its ID
// Requires admin authentication, sets abilities, and checks if the user can perform the 'delete' action on 'Categories'
router
  .route("/:categoryId")
  .delete(
    adminAuth,
    setAbilities,
    canPerform("delete", "Categories"),
    category.deleteBrand
  );

// Export the router to be used in other parts of the application
module.exports = router;
