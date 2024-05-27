const router = require(`express`).Router();

const { controller: auth } = require("../../../api/v1/seller/auth");
const { controller: profile } = require("../../../api/v1/seller/profile");
const { controller: admin } = require("../../../api/v1/admin");

const { sellerAuthMiddleware } = require(`../../../middleware/auth.middleware`);
const isLoginMiddleware = require(`../../../middleware/isSellerLoginMiddleware`);

const rateLimiter = require("../../../utils/rateLimit.utils");
const restricted = require("../../../middleware/restricted.middleware");
const { UserRolesEnum } = require("../../../constants");

const restrictedArray = restricted(
  UserRolesEnum.ADMIN,
  UserRolesEnum.EDITOR,
  UserRolesEnum.MANAGER
);
// this route is reset password route patch using method
router.route(`/auth/reset-password/:resetToken`).patch(auth.resetPassword);

// this route send code on email verify token
router
  .route(`/auth/verify-email/:verificationToken`)
  .get(auth.emailVerification);

// register route using post method
router
  .route(`/auth/register`)
  .post(rateLimiter, isLoginMiddleware, admin.register);

// login route using post method
router.route(`/auth/login`).post(rateLimiter, isLoginMiddleware, auth.login);
// register forgot password using post method
router.route(`/auth/forgot-password`).post(auth.forgotPassword);

// protected routes start
// logout route using post method
router
  .route(`/profile/logout`)
  .post(sellerAuthMiddleware, restrictedArray, auth.logout);

router
  .route(`/profile/:seller_id`)
  .get(sellerAuthMiddleware, restrictedArray, profile.findOne);

router
  .route(`/profile`)
  .get(sellerAuthMiddleware, restrictedArray, profile.findSingle);

router
  .route(`/profile`)
  .patch(sellerAuthMiddleware, restrictedArray, profile.update);

module.exports = router;
