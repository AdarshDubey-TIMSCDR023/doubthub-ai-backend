const express = require("express");

const router = express.Router();


// ================= CONTROLLERS =================
const {
  createDoubt,
  getAllDoubts,
  askAI,
} = require("../controllers/doubtController");


// ================= MIDDLEWARE =================
const {
  protect,
} = require("../middleware/authMiddleware");


// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get All Doubts
router.get(
  "/",
  getAllDoubts
);


// ======================================================
// PROTECTED ROUTES
// ======================================================

// Create Doubt
router.post(
  "/",
  protect,
  createDoubt
);


// AI Chat
router.post(
  "/ask-ai",
  protect,
  askAI
);


// ======================================================

module.exports = router;