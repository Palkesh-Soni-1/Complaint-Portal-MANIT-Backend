import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
import cors from 'cors';

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

import studentRouter from "./routes/student.routes.js"
app.use("/",studentRouter);

import complaintRouter from './routes/complaint.router.js';
app.use("/complaint",complaintRouter);


app.listen(PORT, () => {
    console.log(`Server is running`);
})


