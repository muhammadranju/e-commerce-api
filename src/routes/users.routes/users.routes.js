const router = require("express").Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { controller: user } = require("../../api/v1/user");
const { setAbilities, canPerform } = require("../../middleware/restrictedMode");

router
  .route("/profile")
  .get(
    authMiddleware,
    setAbilities,
    canPerform("read", "Users"),
    user.findSingle
  );
router
  .route("/profile")
  .patch(
    authMiddleware,
    setAbilities,
    canPerform("update", "Users"),
    user.update
  );
router
  .route("/change-password")
  .post(
    authMiddleware,
    setAbilities,
    canPerform("create", "Users"),
    user.changePassword
  );

module.exports = router;
