const router = require("express").Router();

const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: user } = require("../../api/v1/user");
const { UserRolesEnum } = require("../../constants");

const restricted = require("../../middleware/restricted.middleware");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router.route("/profile").get(authMiddleware, restrictedArray, user.findSingle);
router.route("/profile").patch(authMiddleware, restrictedArray, user.update);
router
  .route("/change-password")
  .post(authMiddleware, restrictedArray, user.changePassword);

module.exports = router;
