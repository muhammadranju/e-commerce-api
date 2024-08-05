const { sellerAuthMiddleware } = require("../../../middleware/auth.middleware");

const { controller: admin } = require("../../../api/v1/admin/sellers");
const {
  setAbilities,
  canPerform,
} = require("../../../middleware/restrictedMode");
const rateLimiter = require("../../../utils/rateLimit.utils");
const router = require("express").Router();
const isLoginMiddleware = require(`../../../middleware/isSellerLoginMiddleware`);

router
  .route(`/seller/auth/register`)
  .post(rateLimiter, isLoginMiddleware, admin.register);
router.route(`/seller/profile`).get(
  sellerAuthMiddleware,
  setAbilities,
  canPerform("read", "Seller")
  // profile.findOne
);
router.route(`/seller/profile/:seller_id`).get(
  sellerAuthMiddleware,
  setAbilities,
  canPerform("read", "Seller")
  // profile.findSingle
);

router.route(`/seller/profile/:seller_id`).patch(
  sellerAuthMiddleware,
  setAbilities,
  canPerform("update", "Seller")
  // profile.update
);
module.exports = router;
