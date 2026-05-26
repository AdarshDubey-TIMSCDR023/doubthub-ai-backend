const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");


// ================= LOAD ENV =================
dotenv.config();


// ================= DATABASE =================
const connectDB = require("./config/db");


// ================= ROUTES =================
const authRoutes =
  require("./routes/authRoutes");

const doubtRoutes =
  require("./routes/doubtRoutes");

const uploadRoutes =
  require("./routes/uploadRoutes");


// ================= CONNECT DB =================
connectDB();


// ================= APP =================
const app = express();


// ================= CORS =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",

      "https://doubt-hub-ai.vercel.app",
    ],

    credentials: true,
  })
);


// ================= BODY PARSER =================
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ================= ROOT ROUTE =================
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "DoubtHub AI API Running...",
  });
});


// ================= API ROUTES =================

// AUTH
app.use(
  "/api/auth",
  authRoutes
);

// DOUBTS
app.use(
  "/api/doubts",
  doubtRoutes
);

// UPLOAD
app.use(
  "/api/upload",
  uploadRoutes
);


// ================= SERVER =================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});
