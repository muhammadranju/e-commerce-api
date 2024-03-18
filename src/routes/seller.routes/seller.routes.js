const router = require(`express`).Router();
const auth = require(`../../controller/seller.controller/seller.controller`);
const profile = require(`../../controller/seller.controller/sellerProfile.controller`);

const { sellerAuthMiddleware } = require(`../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../middleware/isLogin.middleware`);

const routerName = `seller`;

// this route is reset password route patch using method
router
  .route(`/auth/reset-password/:resetToken`)
  .patch(auth.resetPasswordSellerPostController);

// this route send code on email verify token
router
  .route(`/auth/verify-email/:verificationToken`)
  .get(auth.emailVerificationSellerPostController);

// register route using post method
router
  .route(`/auth/register`)
  .post(isLoginMiddleware, auth.signupSellerPostController);

// login route using post method
router
  .route(`/auth/login`)
  .post(isLoginMiddleware, auth.loginSellerPostController);
// register forgot password using post method
router
  .route(`/auth/forgot-password`)
  .post(auth.forgotPasswordSellerPostController);

// protected routes start
// logout route using post method
router
  .route(`/auth/logout`)
  .post(sellerAuthMiddleware, auth.logoutSellerPostController);

router
  .route(`/profile`)
  .get(sellerAuthMiddleware, profile.getSellerProfilePostController);

router
  .route(`/profile`)
  .patch(sellerAuthMiddleware, profile.updateSellerProfilePostController);

module.exports = router;
