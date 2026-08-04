const express = require("express");
const router = express.Router();

const {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  markAsReturned,
} = require("../controllers/itemController");

const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllItems);
router.get("/my-items", authMiddleware, getMyItems);
router.get("/:id", getItemById);

// Protected Routes
router.post("/add", authMiddleware, addItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);
router.patch("/return/:id", authMiddleware, markAsReturned);

module.exports = router;