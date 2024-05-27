const router = require("express").Router();
// const reviews = require("../../controller/comments.controller/comments.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: reviews } = require("../../api/v1/reviews");
const restricted = require("../../middleware/restricted.middleware");
const { UserRolesEnum } = require("../../constants");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router.route("/reviews").post(authMiddleware, restrictedArray, reviews.create);
router.route("/reviews").patch(authMiddleware, restrictedArray, reviews.update);

module.exports = router;
