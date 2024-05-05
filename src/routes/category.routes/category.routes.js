const router = require("express").Router();
const { controller: category } = require("../../api/v1/category");

router.route("/:categoryId").get(category.findSingle);
router.route("/").post(category.create);
router.route("/").get(category.findAll);
router.route("/:categoryId").patch(category.update);
router.route("/:categoryId").delete(category.deleteBrand);

module.exports = router;
