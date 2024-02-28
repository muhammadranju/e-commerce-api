const router = require("express").Router();
const brand = require("../../controller/brand.controller/brand.controller");

router.route("/brand").get(brand.fetchAllBrandsGetController);
router.route("/brand").post(brand.createBrandPostController);
router.route("/brand/:brandId").get(brand.getBrandByIdGetController);
router.route("/brand/:brandId").patch(brand.updateBrandByIdPatchController);
router.route("/brand/:brandId").delete(brand.deleteBrandByIdDeleteController);

module.exports = router;
