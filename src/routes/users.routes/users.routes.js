const router = require("express").Router();

const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: user } = require("../../api/v1/user");

router.route("/profile").get(authMiddleware, user.findSingle);
router.route("/profile").patch(authMiddleware, user.update);
router.route("/change-password").post(authMiddleware, user.changePassword);

module.exports = router;
