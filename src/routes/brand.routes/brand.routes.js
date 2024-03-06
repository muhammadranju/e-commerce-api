const router = require("express").Router();
const brand = require("../../controller/brand.controller/brand.controller");

router.route("/brands").get(brand.fetchAllBrandsGetController);
router.route("/brands").post(brand.createBrandPostController);
router.route("/brands/:brandId").get(brand.getBrandByIdGetController);
router.route("/brands/:brandId").patch(brand.updateBrandByIdPatchController);
router.route("/brands/:brandId").delete(brand.deleteBrandByIdDeleteController);

module.exports = router;
