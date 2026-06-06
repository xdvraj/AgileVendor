const { Router } = require("express");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/auth");
const { signup, login, getMe, logout } = require("../controllers/auth");

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
