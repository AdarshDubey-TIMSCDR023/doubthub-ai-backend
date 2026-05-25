const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      },
    });

  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });

    // Compare password
    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          token: generateToken(user._id),
        },
      });

    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET USER PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {
    console.log("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};