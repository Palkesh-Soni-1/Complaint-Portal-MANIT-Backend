import express from "express";

// Complaints Controller ------------------------------
import complaintPostController from "../controllers/complaintPost.controller.js";
import getComplaintsByStudentIdController from "../controllers/getComplaintByStudentId.controller.js";
import getComplaintsByComplaintIdController from "../controllers/getComplaintByComplaintId.controller.js";
import getAssignedComplaintsController from "../controllers/getAssignedComplaints.controller.js";
import getOpenComplaintsController from "../controllers/getOpenComplaint.controller.js";

import statusChangeController from "../controllers/statusChange.controller.js";

import { authenticateAdmin, authenticateIntermediate, authenticateStudent } from "../middlewares/auth.middleware.js";


const complaintRouter = express.Router();

// Student Routes --------------------------------------
complaintRouter.post("/post",authenticateStudent,complaintPostController);
complaintRouter.get(
  "/get",
  authenticateStudent,
  getComplaintsByStudentIdController
);
complaintRouter.get("/getById",authenticateStudent,getComplaintsByComplaintIdController);


// Intermediate Routes ----------------------------------
complaintRouter.get("/get/open",authenticateIntermediate,getOpenComplaintsController);
complaintRouter.patch("/intermediate/status",authenticateIntermediate,statusChangeController);


// Admin Routes -----------------------------------------
complaintRouter.get("/get/assigned",authenticateAdmin,getAssignedComplaintsController);
complaintRouter.patch("/admin/status",authenticateAdmin,statusChangeController);

export default complaintRouter;