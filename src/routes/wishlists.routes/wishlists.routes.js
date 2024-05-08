const router = require("express").Router();

const { authMiddleware } = require("../../middleware/auth.middleware");

const { controller: wishlist } = require("../../api/v1/wishlist");

router.route("/").get(authMiddleware, wishlist.findAll);
router.route("/").post(authMiddleware, wishlist.create);
router.route("/").delete(authMiddleware, wishlist.deleteItem);

module.exports = router;
