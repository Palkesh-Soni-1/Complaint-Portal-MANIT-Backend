import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import SuperAdmin from "../models/superAdmin.model.js";


export async function authenticateAdmin (req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }
    const decoded = jwt.verify(token, process.env.SECRET || "secrett");

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export async function authenticateSuperAdmin (req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.SECRET || "secrett");
    
    const superAdmin = await SuperAdmin.findById(decoded.id).select(
      "-password"
    );

    if (!superAdmin) {
      return res.status(401).json({ message: "Not authorized as superadmin" });
    }

    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
