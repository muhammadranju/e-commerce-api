const router = require("express").Router();

router.route("/wishlist").get();
router.route("/wishlist/add").post();
router.route("/wishlist/remove").delete();

module.exports = router;
