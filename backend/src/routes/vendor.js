const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createVendorSchema, updateVendorSchema, querySchema } = require("../validators/vendor");
const { getAll, getById, create, update, remove } = require("../controllers/vendor");

const router = Router();

router.use(protect);

router.get("/", validate(querySchema), getAll);
router.post("/", authorize("admin", "procurement_officer"), validate(createVendorSchema), create);
router.get("/:id", getById);
router.patch("/:id", authorize("admin", "procurement_officer"), validate(updateVendorSchema), update);
router.delete("/:id", authorize("admin"), remove);

module.exports = router;
