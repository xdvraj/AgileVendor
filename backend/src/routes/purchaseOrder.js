const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createPOSchema, sendSchema } = require("../validators/purchaseOrder");
const { getAll, getById, create, send } = require("../controllers/purchaseOrder");

const router = Router();

router.use(protect);

router.get("/", getAll);
router.post("/", authorize("admin", "procurement_officer"), validate(createPOSchema), create);
router.get("/:id", getById);
router.post("/:id/send", authorize("admin", "procurement_officer"), validate(sendSchema), send);

module.exports = router;
