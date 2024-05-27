const router = require("express").Router();
const { store } = require("../../api/v1/seller");
const { UserRolesEnum } = require("../../constants");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");

const restricted = require("../../middleware/restricted.middleware");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER,
  UserRolesEnum.SELLER
);
router
  .route("/stores")
  .post(sellerAuthMiddleware, restrictedArray, store.create);
router.route("/stores/:storeId").get(store.findSingle);
router
  .route("/stores/:storeId")
  .patch(sellerAuthMiddleware, restrictedArray, store.update);
router
  .route("/stores/:storeId")
  .delete(sellerAuthMiddleware, restrictedArray, store.deleteShop);

module.exports = router;
