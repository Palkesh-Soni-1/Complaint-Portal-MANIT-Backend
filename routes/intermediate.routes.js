import express from "express";
const intermediateRouter = express.Router();
import jwt from "jsonwebtoken";
import Intermediate from "../models/intermediate.model.js";
import Admin from "../models/admin.model.js";
import { authenticateIntermediate } from "../middlewares/auth.middleware.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

intermediateRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const intermediate = await Intermediate.findOne({ username });

    if (!intermediate) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!intermediate.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await intermediate.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    intermediate.lastLogin = Date.now();
    await intermediate.save();

    const token = jwt.sign({ id: intermediate._id }, process.env.SECRET || "secrett", {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      token,
      intermediate: {
        id: intermediate._id,
        username: intermediate.username,
        fullName: intermediate.fullName,
        role: intermediate.role,
        department: intermediate.department,
        email: intermediate.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

intermediateRouter.get("/me", authenticateIntermediate, async (req, res) => {
  try {
    const intermediate = await Intermediate.findById(req.intermediate.id).select("-password");
    res.status(200).json(intermediate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

intermediateRouter.put("/change-password", authenticateIntermediate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const intermediate = await Intermediate.findById(req.intermediate.id);

    const isMatch = await intermediate.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    intermediate.password = newPassword;
    intermediate.updatedAt = Date.now();
    await intermediate.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// @route   GET /api/intermediate/admins
// @desc    Get all admins
// @access  Private (Intermediate only)
intermediateRouter.get("/admins", authenticateIntermediate, async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default intermediateRouter;
