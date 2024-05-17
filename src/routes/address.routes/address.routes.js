const router = require("express").Router();
const { controller: address } = require("../../api/v1/address/");
const auth = require("../../middleware/auth.middleware");

router.route("/profile/addresses").get(auth.authMiddleware, address.findAll);
router.route("/profile/address").post(auth.authMiddleware, address.create);
router.route("/profile/address").patch(auth.authMiddleware, address.update);
router
  .route("/profile/address/")
  .delete(auth.authMiddleware, address.deleteAddress);

module.exports = router;
