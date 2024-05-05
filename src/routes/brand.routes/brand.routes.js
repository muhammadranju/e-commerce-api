const router = require("express").Router();
const { controller: brand } = require("../../api/v1/brand");

router.route("/").get(brand.findAll);
router.route("/").post(brand.create);
router.route("/:brandId").get(brand.findSingle);
router.route("/:brandId").patch(brand.update);
router.route("/:brandId").delete(brand.deleteBrand);

module.exports = router;
