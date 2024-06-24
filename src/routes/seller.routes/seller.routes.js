const router = require(`express`).Router();
const { controller: auth } = require("../../api/v1/seller/auth");
const { controller: profile } = require("../../api/v1/seller/profile");
const { sellerAuthMiddleware } = require(`../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../middleware/isSellerLoginMiddleware`);
const rateLimiter = require("../../utils/rateLimit.utils");
const { canPerform, setAbilities } = require("../../middleware/restrictedMode");

// this route is reset password route patch using method
router.route(`/auth/reset-password/:resetToken`).patch(auth.resetPassword);

// this route send code on email verify token
router
  .route(`/auth/verify-email/:verificationToken`)
  .get(auth.emailVerification);

// register route using post method
router
  .route(`/auth/register`)
  .post(rateLimiter, isLoginMiddleware, auth.signup);

// login route using post method
router.route(`/auth/login`).post(rateLimiter, isLoginMiddleware, auth.login);
// register forgot password using post method
router.route(`/auth/forgot-password`).post(auth.forgotPassword);

// protected routes start
// logout route using post method
router
  .route(`/auth/logout`)
  .post(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    auth.logout
  );

router
  .route(`/profile/:seller_id`)
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    profile.findOne
  );

router
  .route(`/profile`)
  .get(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("read", "Orders"),
    profile.findSingle
  );

router
  .route(`/profile/`)
  .patch(
    sellerAuthMiddleware,
    setAbilities,
    canPerform("update", "Orders"),
    profile.update
  );

module.exports = router;
