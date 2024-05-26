const router = require("express").Router();
const { store } = require("../../api/v1/seller");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");

router.route("/stores").post(sellerAuthMiddleware, store.create);
router.route("/stores/:storeId").get(store.findSingle);
router.route("/stores/:storeId").patch(sellerAuthMiddleware, store.update);
router.route("/stores/:storeId").delete(sellerAuthMiddleware, store.deleteShop);

module.exports = router;
