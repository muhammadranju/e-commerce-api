const router = require("express").Router();
const { controller: brand } = require("../../api/v1/brand");
const { UserRolesEnum } = require("../../constants");
const restricted = require("../../middleware/restricted.middleware");
const {
  sellerAuthMiddleware: adminAuth,
} = require("../../middleware/auth.middleware");
/**
 * Restricts access to the specified user roles.
 * @param {...UserRolesEnum} roles - The user roles to restrict access for.
 * @returns {Array<string>} An array of restricted user roles.
 */
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER
);

router.route("/").get(brand.findAll);
router.route("/").post(adminAuth, restrictedArray, brand.create);
router.route("/:brandId").get(brand.findSingle);
router.route("/:brandId").patch(adminAuth, restrictedArray, brand.update);
router.route("/:brandId").delete(adminAuth, restrictedArray, brand.deleteBrand);

module.exports = router;
