const router = require("express").Router();

const { controller: cart } = require("../../api/v1/cart");

const { authMiddleware } = require("../../middleware/auth.middleware");

router.route("/").get(authMiddleware, cart.findAll);
router.route("/").post(authMiddleware, cart.create);
router.route("/:productId").patch(authMiddleware, cart.update);
router.route("/:productId").delete(authMiddleware, cart.deleteItem);
router.route("/empty").delete(authMiddleware, cart.deleteAll);

module.exports = router;
