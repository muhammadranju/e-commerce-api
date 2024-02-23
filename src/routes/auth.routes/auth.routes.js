const router = require("express").Router();

router.route("/auth/signup").post();
router.route("/auth/login").post();
router.route("/auth/logout").post();
router.route("/auth/reset-password").post();
router.route("/auth/change-password").post();

module.exports = router;
