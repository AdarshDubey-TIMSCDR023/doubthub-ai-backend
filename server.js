const express = require("express");
const dotenv = require("dotenv");

// Load .env FIRST
dotenv.config();

const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const doubtRoutes = require("./routes/doubtRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


// ================= DEBUG =================

console.log("Cloudinary URL:", process.env.CLOUDINARY_URL);


// ================= DATABASE =================

connectDB();

const app = express();


// ================= MIDDLEWARE =================

// CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ================= ROOT ROUTE =================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DoubtHub AI API Running...",
  });
});


// ================= API ROUTES =================

// Authentication
app.use("/api/auth", authRoutes);

// Doubts
app.use("/api/doubts", doubtRoutes);

// Upload
app.use("/api/upload", uploadRoutes);


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});