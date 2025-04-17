import express from "express";
import studentLoginController from "../controllers/studentLogin.controller.js";
import { studentTokenGenerationController } from "../controllers/studentTokenGeneration.controller.js";
const studentRouter = express.Router();
studentRouter.post("/login",studentLoginController);
studentRouter.post("/generateToken",studentTokenGenerationController);
export default studentRouter;