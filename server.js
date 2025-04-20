import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
import cors from "cors";
import morgan from "morgan";

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import studentRouter from "./routes/student.routes.js";
app.use("/", studentRouter);

import complaintRouter from "./routes/complaint.router.js";
app.use("/complaint", complaintRouter);

import adminRouter from "./routes/admin.routes.js";
app.use("/admin", adminRouter);

import superAdminRouter from "./routes/superAdmin.routes.js";
app.use("/superadmin", superAdminRouter);

import intermediateRouter from "./routes/intermediate.routes.js";
app.use("/intermediate",intermediateRouter);

import job from "./cron.js";
job.start();

app.listen(PORT, () => {
  console.log(`Server is running`);
});
