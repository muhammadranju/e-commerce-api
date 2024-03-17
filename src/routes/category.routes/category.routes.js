const router = require("express").Router();
const category = require("../../controller/category.controller/category.controller");

router.route("/:categoryId").get(category.categoriesGetByIdController);
router.route("/").post(category.categoriesPostController);
router.route("/").get(category.categoriesGetController);
router.route("/:categoryId").patch(category.categoriesPatchByIdController);
router.route("/:categoryId").delete(category.categoriesDeleteByIdController);

module.exports = router;
