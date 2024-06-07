const router = require("express").Router();
const { controller: store } = require("../../../api/v1/admin");
const { sellerAuthMiddleware } = require("../../../middleware/auth.middleware");
const {
  setAbilities,
  canPerform,
} = require("../../../middleware/restrictedMode");

router
  .route("/stores")
  .post(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("create", "Stores"),
    store.storeCreate
  );
// router.route("/stores/:storeId").get(store);
// router
//   .route("/stores/:storeId")
//   .patch(
//     sellerAuthMiddleware,
//     setAbilities,
//     canPerform("update", "Stores"),
//     store.update
//   );
// router
//   .route("/stores/:storeId")
//   .delete(
//     sellerAuthMiddleware,
//     setAbilities,
//     canPerform("delete", "Stores"),
//     store.deleteShop
//   );

module.exports = router;
