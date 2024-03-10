const router = require("express").Router();
const auth = require("../../controller/seller.routes/seller.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const isLoginMiddleware = require("../../middleware/isLogin.middleware");

// this route is reset password route patch using method
router
  .route("/sellers/auth/reset-password/:resetToken")
  .patch(auth.resetPasswordSellerPostController);

// this route send code on email verify token
router
  .route("/sellers/auth/verify-email/:verificationToken")
  .get(auth.emailVerificationSellerPostController);

// register route using post method
router
  .route("/sellers/auth/register")
  .post(isLoginMiddleware, auth.signupSellerPostController);

// login route using post method
router
  .route("/sellers/auth/login")
  .post(isLoginMiddleware, auth.loginSellerPostController);

// logout route using post method
router.route("/sellers/auth/logout").post(auth.logoutSellerPostController);

// register forgot password using post method
router
  .route("/sellers/auth/forgot-password")
  .post(auth.forgotPasswordSellerPostController);

module.exports = router;
