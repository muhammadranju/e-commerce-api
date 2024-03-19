const router = require("express").Router();
const address = require("../../controller/address.controller/address.controller");
const Auth = require("../../middleware/auth.middleware");

router
  .route("/profile/address")
  .get(Auth.authMiddleware, address.fetchAddressGetController);
router
  .route("/profile/address")
  .post(Auth.authMiddleware, address.createAddressPostController);
router
  .route("/profile/address")
  .patch(Auth.authMiddleware, address.updateAddressPatchController);
router
  .route("/profile/address/:addressId")
  .delete(Auth.authMiddleware, address.deleteAddressDeleteController);

module.exports = router;
