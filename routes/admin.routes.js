import express from "express";
const adminRouter = express.Router();
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";


adminRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    admin.lastLogin = Date.now();
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.SECRET || "secrett", {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
        department: admin.department,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

adminRouter.get("/me", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

adminRouter.put("/change-password", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const admin = await Admin.findById(req.admin.id);

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    admin.updatedAt = Date.now();
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default adminRouter;