import express from "express"
const superAdminRouter = express.Router();
import jwt from "jsonwebtoken"
import SuperAdmin from "../models/superAdmin.model.js";
import Admin from "../models/admin.model.js"
import { authenticateSuperAdmin } from "../middlewares/auth.middleware.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// @route   POST /api/superadmin/login
// @desc    Login superadmin
// @access  Public
superAdminRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const superAdmin = await SuperAdmin.findOne({ username });

    if (!superAdmin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await superAdmin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    superAdmin.lastLogin = Date.now();
    await superAdmin.save();

    const token = jwt.sign(
      { id: superAdmin._id },
      process.env.SECRET || "secrett",
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      token,
      superAdmin: {
        id: superAdmin._id,
        username: superAdmin.username,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/superadmin/me
// @desc    Get current superadmin
// @access  Private
superAdminRouter.get("/me", authenticateSuperAdmin, async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.superAdmin.id).select(
      "-password"
    );
    res.status(200).json(superAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/superadmin/change-password
// @desc    Change superadmin password
// @access  Private
superAdminRouter.put(
  "/change-password",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Please enter all fields" });
      }

      const superAdmin = await SuperAdmin.findById(req.superAdmin.id);

      const isMatch = await superAdmin.comparePassword(currentPassword);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      superAdmin.password = newPassword;
      await superAdmin.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ADMIN MANAGEMENT ROUTES

// @route   POST /api/superadmin/admins
// @desc    Create a new admin
// @access  Private (SuperAdmin only)
superAdminRouter.post("/admins", authenticateSuperAdmin, async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      role,
      department,
      email,
      contactNumber,
    } = req.body;

    if (!username || !password || !fullName || !role || !department || !email) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this username or email already exists" });
    }

    const newAdmin = new Admin({
      username,
      password,
      fullName,
      role,
      department,
      email,
      contactNumber,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        fullName: newAdmin.fullName,
        role: newAdmin.role,
        department: newAdmin.department,
        email: newAdmin.email,
        contactNumber: newAdmin.contactNumber,
        isActive: newAdmin.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/superadmin/admins
// @desc    Get all admins
// @access  Private (SuperAdmin only)
superAdminRouter.get("/admins", authenticateSuperAdmin, async (req, res) => {
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

// @route   GET /api/superadmin/admins/:id
// @desc    Get admin by ID
// @access  Private (SuperAdmin only)
superAdminRouter.get(
  "/admins/:id",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/superadmin/admins/:id
// @desc    Update admin
// @access  Private (SuperAdmin only)
superAdminRouter.put(
  "/admins/:id",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const { fullName, role, department, email, contactNumber, isActive } =
        req.body;

      // Build admin object
      const adminFields = {};
      if (fullName) adminFields.fullName = fullName;
      if (role) adminFields.role = role;
      if (department) adminFields.department = department;
      if (email) adminFields.email = email;
      if (contactNumber) adminFields.contactNumber = contactNumber;
      if (isActive !== undefined) adminFields.isActive = isActive;
      adminFields.updatedAt = Date.now();

      // Update admin
      const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        { $set: adminFields },
        { new: true }
      ).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/superadmin/admins/:id/reset-password
// @desc    Reset admin password
// @access  Private (SuperAdmin only)
superAdminRouter.put(
  "/admins/:id/reset-password",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const { newPassword } = req.body;

      if (!newPassword) {
        return res
          .status(400)
          .json({ message: "Please provide a new password" });
      }

      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Update password
      admin.password = newPassword;
      admin.updatedAt = Date.now();
      await admin.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/superadmin/admins/:id
// @desc    Delete admin
// @access  Private (SuperAdmin only)
superAdminRouter.delete(
  "/admins/:id",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      await admin.deleteOne();;

      res.status(200).json({ message: "Admin removed" });
    } catch (error) {
      console.error(error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default superAdminRouter;
