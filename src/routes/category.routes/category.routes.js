const router = require("express").Router();
const { controller: category } = require("../../api/v1/category");
const { UserRolesEnum } = require("../../constants");
const restricted = require("../../middleware/restricted.middleware");
const {
  sellerAuthMiddleware: adminAuth,
} = require("../../middleware/auth.middleware");
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER
);
router.route("/:categoryId").get(category.findSingle);
router.route("/").get(category.findAll);

router.route("/").post(adminAuth, restrictedArray, category.create);
router.route("/:categoryId").patch(adminAuth, restrictedArray, category.update);
router
  .route("/:categoryId")
  .delete(adminAuth, restrictedArray, category.deleteBrand);

module.exports = router;
