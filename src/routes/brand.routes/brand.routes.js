const router = require("express").Router();
const { controller: brand } = require("../../api/v1/brand");
const {
  sellerAuthMiddleware: adminAuth,
} = require("../../middleware/auth.middleware");

const { canPerform, setAbilities } = require("../../middleware/restrictedMode");

/**
 * Restricts access to the specified user roles.
 * @param {...UserRolesEnum} roles - The user roles to restrict access for.
 * @returns {Array<string>} An array of restricted user roles.
 */

router.route("/").get(brand.findAll);
router.route("/:brandId").get(brand.findSingle);

router
  .route("/")
  .post(adminAuth, setAbilities, canPerform("create", "Brands"), brand.create);
router
  .route("/:brandId")
  .patch(adminAuth, setAbilities, canPerform("update", "Brands"), brand.update);
router
  .route("/:brandId")
  .delete(
    adminAuth,
    setAbilities,
    canPerform("delete", "Brands"),
    brand.deleteBrand
  );

module.exports = router;
