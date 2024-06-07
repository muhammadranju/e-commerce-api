const router = require("express").Router();

const auth = require("./auth/register.routes");
const seller = require("./seller/seller.routes");
const store = require("./store/store.routes");
const user = require("./user/users.routes");

router.use([user, auth, seller, store]);

module.exports = router;
