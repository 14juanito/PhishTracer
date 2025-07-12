const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  createFirstAdmin
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/auth");
const { authLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/create-admin", authLimiter, validate(registerSchema), createFirstAdmin);

module.exports = router;