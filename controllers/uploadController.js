const cloudinary = require("../config/cloudinary");


// ================= IMAGE UPLOAD =================
const uploadImage = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("Uploading:", req.file.originalname);

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "doubthub-ai",
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });

  } catch (error) {

    console.log("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};


module.exports = {
  uploadImage,
};