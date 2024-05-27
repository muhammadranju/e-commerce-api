const router = require("express").Router();
const restricted = require("../../middleware/restricted.middleware");
const { UserRolesEnum } = require("../../constants");
const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router.route("/generate-token").post(restrictedArray);
router.route("/process").post(restrictedArray);
router.route("/failed").post(restrictedArray);
router.route("/history").get(restrictedArray);

module.exports = router;
