const User = require("../models/user.models");


const getAllUsers = async (req, res) => {
  try {
    const id = req.user.id;
    const isAdmin = await User.findById(id);

    if (isAdmin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const id = req.user.id;
    const isAdmin = await User.findById(id);

    if (isAdmin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { role: "admin" });
    return res.status(200).json({ message: "User promoted to admin" });
  } catch (error) {
    console.error("Error promoting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers, makeAdmin };