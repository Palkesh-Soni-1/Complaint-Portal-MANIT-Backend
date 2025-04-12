import express from "express";
import studentLoginController from "../controllers/studentLogin.controller.js";
const studentRouter = express.Router();
studentRouter.post("/login",studentLoginController);
export default studentRouter;