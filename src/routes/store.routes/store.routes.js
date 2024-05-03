const router = require("express").Router();
const { store } = require("../../api/v1/seller");
const { sellerAuthMiddleware } = require("../../middleware/auth.middleware");

router.route("/store").post(sellerAuthMiddleware, store.create);
router.route("/store/:storeId").get(store.findSingle);
router.route("/store/:storeId").patch(sellerAuthMiddleware, store.update);
router.route("/store/:storeId").delete(sellerAuthMiddleware, store.deleteShop);

module.exports = router;
