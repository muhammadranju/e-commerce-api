const router = require(`express`).Router();
const auth = require(`../../controller/seller.controller/seller.controller`);

const { sellerAuthMiddleware } = require(`../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../middleware/isLogin.middleware`);

const routerName = `seller`;

// this route is reset password route patch using method
router
  .route(`/${routerName}/auth/reset-password/:resetToken`)
  .patch(auth.resetPasswordSellerPostController);

// this route send code on email verify token
router
  .route(`/${routerName}/auth/verify-email/:verificationToken`)
  .get(auth.emailVerificationSellerPostController);

// register route using post method
router
  .route(`/${routerName}/auth/register`)
  .post(isLoginMiddleware, auth.signupSellerPostController);

// login route using post method
router
  .route(`/${routerName}/auth/login`)
  .post(isLoginMiddleware, auth.loginSellerPostController);

// register forgot password using post method
router
  .route(`/${routerName}/auth/forgot-password`)
  .post(auth.forgotPasswordSellerPostController);

// protected routes start
// logout route using post method
router
  .route(`/${routerName}/auth/logout`)
  .post(sellerAuthMiddleware, auth.logoutSellerPostController);

router
  .route(`/${routerName}/profile`)
  .get(sellerAuthMiddleware, auth.getSellerProfilePostController);
router
  .route(`/${routerName}/profile`)
  .patch(sellerAuthMiddleware, auth.updateSellerProfilePostController);

module.exports = router;
