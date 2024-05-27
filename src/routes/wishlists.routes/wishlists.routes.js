const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: wishlist } = require("../../api/v1/wishlist");
const restricted = require("../../middleware/restricted.middleware");
const { UserRolesEnum } = require("../../constants");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router.route("/").get(authMiddleware, restrictedArray, wishlist.findAll);
router.route("/").post(authMiddleware, restrictedArray, wishlist.create);
router.route("/").delete(authMiddleware, restrictedArray, wishlist.deleteItem);

module.exports = router;
