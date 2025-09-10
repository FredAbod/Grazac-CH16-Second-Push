const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/email");
const cloudinary  = require("../config/cloudinary");

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      phoneNumber,
    });
    await newUser.save();

    await sendEmail(newUser.email, "Welcome to Our Service", `Your OTP is ${otp}`);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUsername = async (req, res) => {
  try {
    const { id } = req.user;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ message: "New username is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = newUsername;
    await user.save();

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Check if user exists
    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    await sendEmail(user.email, "OTP Verified", "You Just Verified Your Otp")

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if OTP is valid
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Reset password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; // Clear OTP after successful reset
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.user;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findById(id);
    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({ message: "Profile picture uploaded successfully", url: result.secure_url });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  updateUsername,
  verifyOtp,
  uploadProfilePicture,
  forgotPassword,
  resetPassword
};
