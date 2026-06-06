const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createRfqSchema, updateRfqSchema, assignVendorsSchema, querySchema } = require("../validators/rfq");
const { getAll, getById, create, update, remove, assignVendors } = require("../controllers/rfq");

const router = Router();

router.use(protect);

router.get("/", validate(querySchema), getAll);
router.post("/", authorize("admin", "procurement_officer"), validate(createRfqSchema), create);
router.get("/:id", getById);
router.patch("/:id", authorize("admin", "procurement_officer"), validate(updateRfqSchema), update);
router.delete("/:id", authorize("admin"), remove);
router.post("/:id/assign-vendors", authorize("admin", "procurement_officer"), validate(assignVendorsSchema), assignVendors);

module.exports = router;
