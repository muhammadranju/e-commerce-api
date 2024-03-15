const router = require("express").Router();

const { authMiddleware } = require("../../middleware/auth.middleware");

const changePassword = require("../../controller/auth.controller/auth.controller");
const userController = require("../../controller/users.controller/users.controller");

router
  .route("/user/profile")
  .get(authMiddleware, userController.getUserDataGetController);
router
  .route("/user/profile")
  .patch(authMiddleware, userController.updateUserDataPatchController);
router
  .route("/user/change-password")
  .post(authMiddleware, userController.changePasswordPostController);

module.exports = router;
