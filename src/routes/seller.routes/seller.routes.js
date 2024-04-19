const router = require(`express`).Router();
const auth = require(`../../controller/seller.controller/seller.controller`);
const profile = require(`../../controller/seller.controller/sellerProfile.controller`);

const { sellerAuthMiddleware } = require(`../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../middleware/isSellerLoginMiddleware`);

const rateLimiter = require("../../utils/rateLimit.utils");

// this route is reset password route patch using method
router
  .route(`/auth/reset-password/:resetToken`)
  .patch(auth.resetPasswordSellerController);

// this route send code on email verify token
router
  .route(`/auth/verify-email/:verificationToken`)
  .get(auth.emailVerificationSellerController);

// register route using post method
router
  .route(`/auth/register`)
  .post(rateLimiter, isLoginMiddleware, auth.signupSellerController);

// login route using post method
router
  .route(`/auth/login`)
  .post(rateLimiter, isLoginMiddleware, auth.loginSellerController);
// register forgot password using post method
router.route(`/auth/forgot-password`).post(auth.forgotPasswordSellerController);

// protected routes start
// logout route using post method
router
  .route(`/auth/logout`)
  .post(sellerAuthMiddleware, auth.logoutSellerController);

router
  .route(`/profile/:seller_id`)
  .get(sellerAuthMiddleware, profile.getSingleSellerProfilePostController);

router
  .route(`/profile`)
  .get(sellerAuthMiddleware, profile.getSellerProfilePostController);

router
  .route(`/profile/:seller_id`)
  .patch(sellerAuthMiddleware, profile.updateSellerProfilePostController);

module.exports = router;
