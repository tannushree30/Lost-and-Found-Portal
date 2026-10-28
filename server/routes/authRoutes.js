const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/forgot-password", forgotPassword);

// Protected Route
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;