const router = require("express").Router();
const auth = require("../../controller/auth.controller/auth.controller");

// this route is reset password route patch using method
router
  .route("/auth/reset-password/:resetToken")
  .patch(auth.resetPasswordPostController);

// this route send code on email verify token
router
  .route("/auth/verify-email/:verificationToken")
  .get(auth.emailVerificationController);

// register route using post method
router.route("/auth/register").post(auth.signupPostController);

// login route using post method
router.route("/auth/login").post(auth.loginPostController);

// logout route using post method
router.route("/auth/logout").post(auth.logoutPostController);

// register forgot password using post method
router.route("/auth/forgot-password").post(auth.forgotPasswordPostController);

module.exports = router;
