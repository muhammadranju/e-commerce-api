const router = require("express").Router();
const { controller: address } = require("../../api/v1/address/");
const { UserRolesEnum } = require("../../constants");
const auth = require("../../middleware/auth.middleware");
const restricted = require("../../middleware/restricted.middleware");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.USER
);
router
  .route("/profile/addresses")
  .get(auth.authMiddleware, restrictedArray, address.findAll);
router
  .route("/profile/address")
  .post(auth.authMiddleware, restrictedArray, address.create);
router
  .route("/profile/address")
  .patch(auth.authMiddleware, restrictedArray, address.update);
router
  .route("/profile/address/")
  .delete(auth.authMiddleware, restrictedArray, address.deleteAddress);

module.exports = router;
