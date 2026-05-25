const jwt = require("jsonwebtoken");

const User = require("../models/User");


// ================= PROTECT ROUTE =================
const protect = async (
  req,
  res,
  next
) => {

  try {

    let token;

    // ================= GET TOKEN =================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token =
        req.headers.authorization.split(" ")[1];
    }

    // ================= NO TOKEN =================
    if (!token) {

      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    console.log("TOKEN:", token);

    // ================= VERIFY TOKEN =================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    // ================= FIND USER =================
    const user = await User.findById(
      decoded.id
    ).select("-password");

    // User Not Found
    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Add User To Request
    req.user = user;

    next();

  } catch (error) {

    console.log(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};


module.exports = {
  protect,
};