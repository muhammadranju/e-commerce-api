const router = require("express").Router();
const { controller: address } = require("../../api/v1/address/");
const auth = require("../../middleware/auth.middleware");
const { setAbilities, canPerform } = require("../../middleware/restrictedMode");

router.route("/profile/addresses").get(auth.authMiddleware, address.findAll);
router
  .route("/profile/address")
  .post(
    auth.authMiddleware,
    setAbilities,
    canPerform("create", "Addresses"),
    address.create
  );
router
  .route("/profile/address")
  .patch(
    auth.authMiddleware,
    auth.authMiddleware,
    setAbilities,
    canPerform("update", "Addresses"),
    address.update
  );
router
  .route("/profile/address/")
  .delete(
    auth.authMiddleware,
    setAbilities,
    canPerform("delete", "Addresses"),
    address.deleteAddress
  );

module.exports = router;
