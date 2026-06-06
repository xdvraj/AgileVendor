const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const { vendorPerformance, monthlySpending, rfqStatus, purchaseOrders, invoices } = require("../controllers/report");

const router = Router();

router.use(protect);
router.use(authorize("admin", "procurement_officer"));

router.get("/vendor-performance", vendorPerformance);
router.get("/monthly-spending", monthlySpending);
router.get("/rfq-status", rfqStatus);
router.get("/purchase-orders", purchaseOrders);
router.get("/invoices", invoices);

module.exports = router;
