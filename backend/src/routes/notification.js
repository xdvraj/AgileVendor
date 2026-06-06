const { Router } = require("express");
const { protect } = require("../middleware/auth");
const { getAll, markRead } = require("../controllers/notification");

const router = Router();

router.use(protect);

router.get("/", getAll);
router.patch("/:id/read", markRead);

module.exports = router;
