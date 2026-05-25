const Doubt = require("../models/Doubt");

const {
  generateAIResponse,
} = require("../services/aiService");


// ================= CREATE DOUBT =================
const createDoubt = async (req, res) => {

  try {

    const {
      title,
      description,
      tags,
      image,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Create Doubt
    const doubt = await Doubt.create({
      title,
      description,
      tags,
      image,
      user: req.user._id,
    });

    // Populate User Info
    const populatedDoubt = await Doubt.findById(
      doubt._id
    ).populate(
      "user",
      "name email profilePic"
    );

    // Response
    res.status(201).json({
      success: true,
      message: "Doubt created successfully",
      doubt: populatedDoubt,
    });

  } catch (error) {

    console.log("Create Doubt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET ALL DOUBTS =================
const getAllDoubts = async (req, res) => {

  try {

    const doubts = await Doubt.find()
      .populate(
        "user",
        "name email profilePic"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: doubts.length,
      doubts,
    });

  } catch (error) {

    console.log("Get Doubts Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET SINGLE DOUBT =================
const getSingleDoubt = async (req, res) => {

  try {

    const doubt = await Doubt.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email profilePic"
      )
      .populate(
        "answers.answeredBy",
        "name email profilePic"
      );

    // Check doubt exists
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    res.status(200).json({
      success: true,
      doubt,
    });

  } catch (error) {

    console.log("Get Single Doubt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= DELETE DOUBT =================
const deleteDoubt = async (req, res) => {

  try {

    const doubt = await Doubt.findById(
      req.params.id
    );

    // Check doubt exists
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    // Check owner
    if (
      doubt.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await doubt.deleteOne();

    res.status(200).json({
      success: true,
      message: "Doubt deleted successfully",
    });

  } catch (error) {

    console.log("Delete Doubt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= AI DOUBT SOLVER =================
const askAI = async (req, res) => {

  try {

    const { question } = req.body;

    // Validation
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("AI Question:", question);

    // Generate AI Response
    const aiResponse =
      await generateAIResponse(question);

    res.status(200).json({
      success: true,
      question,
      answer: aiResponse,
    });

  } catch (error) {

    console.log("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI response failed",
    });
  }
};


module.exports = {
  createDoubt,
  getAllDoubts,
  getSingleDoubt,
  deleteDoubt,
  askAI,
};