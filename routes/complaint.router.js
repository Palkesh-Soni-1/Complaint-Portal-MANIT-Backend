import express from "express";
import complaintPostController from "../controllers/complaintPost.controller.js";
import getComplaintsByIdController from "../controllers/getComplaintById.controller.js";
import getAllComplaintsController from "../controllers/getAllComplaints.controller.js";
import statusChangeController from "../controllers/statusChange.controller.js";
import { authenticateAdmin, authenticateStudent } from "../middlewares/auth.middleware.js";
import getComplaintsByComplaintNumberController from "../controllers/getComplaintByComplaintNumber.controller.js";
const complaintRouter = express.Router();

complaintRouter.post("/post",authenticateStudent,complaintPostController);
complaintRouter.get("/get",authenticateStudent,getComplaintsByIdController);
complaintRouter.get("/getID",authenticateStudent,getComplaintsByComplaintNumberController);

complaintRouter.get("/get/all",authenticateAdmin,getAllComplaintsController);
complaintRouter.patch("/status",authenticateAdmin,statusChangeController);

export default complaintRouter;