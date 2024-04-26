const router = require("express").Router();
const auth = require("../../controller/auth.controller/auth.controller");

const controller = require("../../api/v1/auth/controller");

const { authMiddleware } = require("../../middleware/auth.middleware");
const isLoginMiddleware = require("../../middleware/isLogin.middleware");

const rateLimiter = require("../../utils/rateLimit.utils");

// Rate limit middleware to prevent brute force attacks

// this route is reset password route patch using method
router.route("/reset-password/:resetToken").patch(controller.resetPassword);

// this route send code on email verify token
router
  .route("/verify-email/:verificationToken")
  .get(auth.emailVerificationController);

// register route using post method
router
  .route("/register")
  .post(rateLimiter, isLoginMiddleware, controller.signup);

// login route using post method
router.route("/login").post(rateLimiter, isLoginMiddleware, controller.login);

// logout route using post method
router.route("/logout").post(authMiddleware, controller.logout);

// register forgot password using post method
router.route("/forgot-password").post(controller.forgotPassword);

module.exports = router;
