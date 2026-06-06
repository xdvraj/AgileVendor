const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createQuotationSchema, updateQuotationSchema } = require("../validators/quotation");
const { getVendorRfqs, create, update, getByRfq } = require("../controllers/quotation");
const { compare, select } = require("../controllers/comparison");

const router = Router();

router.use(protect);

router.get("/vendor/rfqs", authorize("vendor"), getVendorRfqs);
router.get("/rfqs/:rfqId/quotations/compare", compare);
router.get("/rfqs/:rfqId/quotations", getByRfq);
router.post("/rfqs/:rfqId/quotations", authorize("vendor"), validate(createQuotationSchema), create);
router.patch("/quotations/:id", authorize("vendor"), validate(updateQuotationSchema), update);
router.post("/quotations/:id/select", authorize("admin", "procurement_officer"), select);

module.exports = router;
