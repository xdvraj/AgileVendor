const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createApprovalSchema, actionSchema } = require("../validators/approval");
const { getAll, create, approve, reject } = require("../controllers/approval");

const router = Router();

router.use(protect);

router.get("/", getAll);
router.post("/", authorize("admin", "procurement_officer"), validate(createApprovalSchema), create);
router.post("/:id/approve", authorize("admin", "approver"), validate(actionSchema), approve);
router.post("/:id/reject", authorize("admin", "approver"), validate(actionSchema), reject);

module.exports = router;
