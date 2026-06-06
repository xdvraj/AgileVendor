const { Router } = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAll } = require("../controllers/activityLog");

const router = Router();

router.use(protect);
router.use(authorize("admin", "procurement_officer"));

router.get("/", getAll);

module.exports = router;
