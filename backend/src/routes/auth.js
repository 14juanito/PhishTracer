const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  createFirstAdmin
} = require("../controllers/authController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/create-admin", createFirstAdmin);

module.exports = router;