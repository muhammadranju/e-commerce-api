const router = require("express").Router();
const brand = require("../../controller/brand.controller/brand.controller");

router.route("/").get(brand.fetchAllBrandsGetController);
router.route("/").post(brand.createBrandPostController);
router.route("/:brandId").get(brand.getBrandByIdGetController);
router.route("/:brandId").patch(brand.updateBrandByIdPatchController);
router.route("/:brandId").delete(brand.deleteBrandByIdDeleteController);

module.exports = router;
