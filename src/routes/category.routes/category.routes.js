const router = require("express").Router();
const category = require("../../controller/category.controller/category.controller");

router
  .route("/categories/:categoryId")
  .get(category.categoriesGetByIdController);
router.route("/categories").post(category.categoriesPostController);
router.route("/categories").get(category.categoriesGetController);
router
  .route("/categories/:categoryId")
  .patch(category.categoriesPatchByIdController);
router
  .route("/categories/:categoryId")
  .delete(category.categoriesDeleteByIdController);

module.exports = router;
