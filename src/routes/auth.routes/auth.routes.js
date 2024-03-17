const router = require("express").Router();
const auth = require("../../controller/auth.controller/auth.controller");

const { authMiddleware } = require("../../middleware/auth.middleware");
const isLoginMiddleware = require("../../middleware/isLogin.middleware");

// this route is reset password route patch using method
router
  .route("/reset-password/:resetToken")
  .patch(auth.resetPasswordPostController);

// this route send code on email verify token
router
  .route("/verify-email/:verificationToken")
  .get(auth.emailVerificationController);

// register route using post method
router.route("/register").post(isLoginMiddleware, auth.signupPostController);

// login route using post method
router.route("/login").post(isLoginMiddleware, auth.loginPostController);

// logout route using post method
router.route("/logout").post(authMiddleware, auth.logoutPostController);

// register forgot password using post method
router.route("/forgot-password").post(auth.forgotPasswordPostController);

module.exports = router;
