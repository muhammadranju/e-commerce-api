const router = require("express").Router();
const auth = require("../../controller/auth.controller/auth.controller");

router.route("/auth/register").post(auth.signupPostController);
router.route("/auth/login").post(auth.loginPostController);
router.route("/auth/logout").post(auth.logoutPostController);
router.route("/auth/forgot-password").post(auth.forgotPasswordPostController);
router.route("/auth/reset-password").post(auth.resetPasswordPostController);

module.exports = router;
