const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createInvoiceSchema, emailSchema } = require("../validators/invoice");
const { getAll, getById, create, download, email } = require("../controllers/invoice");

const router = Router();

router.use(protect);

router.get("/", getAll);
router.post("/", authorize("admin", "procurement_officer"), validate(createInvoiceSchema), create);
router.get("/:id", getById);
router.get("/:id/download", download);
router.post("/:id/email", authorize("admin", "procurement_officer"), validate(emailSchema), email);

module.exports = router;
