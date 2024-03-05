const router = require("express").Router();
const auth = require("../../controller/auth.controller/auth.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const isLoginMiddleware = require("../../middleware/isLogin.middleware");

// this route is reset password route patch using method
router
  .route("/auth/reset-password/:resetToken")
  .patch(auth.resetPasswordPostController);

// this route send code on email verify token
router
  .route("/auth/verify-email/:verificationToken")
  .get(auth.emailVerificationController);

// register route using post method
router
  .route("/auth/register")
  .post(isLoginMiddleware, auth.signupPostController);

// login route using post method
router.route("/auth/login").post(isLoginMiddleware, auth.loginPostController);

// logout route using post method
router.route("/auth/logout").post(authMiddleware, auth.logoutPostController);

// register forgot password using post method
router.route("/auth/forgot-password").post(auth.forgotPasswordPostController);

module.exports = router;
