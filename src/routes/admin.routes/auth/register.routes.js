const router = require(`express`).Router();

const { controller: auth } = require("../../../api/v1/seller/auth");
const { controller: profile } = require("../../../api/v1/seller/profile");
const { controller: adminAuth } = require("../../../api/v1/admin/auth");

const { sellerAuthMiddleware } = require(`../../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../../middleware/isSellerLoginMiddleware`);

const rateLimiter = require("../../../utils/rateLimit.utils");
const {
  setAbilities,
  canPerform,
} = require("../../../middleware/restrictedMode");

// this route is reset password route patch using method
router.route(`/auth/reset-password/:resetToken`).patch(auth.resetPassword);

// this route send code on email verify token
router
  .route(`/auth/verify-email/:verificationToken`)
  .get(auth.emailVerification);

// register route using post method
router
  .route(`/auth/register`)
  .post(rateLimiter, isLoginMiddleware, adminAuth.register);

// login route using post method
router.route(`/auth/login`).post(rateLimiter, isLoginMiddleware, auth.login);
// register forgot password using post method
router.route(`/auth/forgot-password`).post(auth.forgotPassword);

// protected routes start
// logout route using post method
router
  .route(`/profile/logout`)
  .post(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("create", "Seller"),
    auth.logout
  );

router
  .route(`/profile/:seller_id`)
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("read", "Seller"),
    profile.findOne
  );

router
  .route(`/profile`)
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("read", "Seller"),
    profile.findSingle
  );

router
  .route(`/profile`)
  .patch(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("update", "Seller"),
    profile.update
  );

module.exports = router;
