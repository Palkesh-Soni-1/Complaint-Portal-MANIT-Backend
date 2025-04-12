import express from "express";
import complaintPostController from "../controllers/complaintPost.controller.js";
import getComplaintsByIdController from "../controllers/getComplaintById.controller.js";
const complaintRouter = express.Router();
complaintRouter.post("/post",complaintPostController);
complaintRouter.get("/get",getComplaintsByIdController);
export default complaintRouter;