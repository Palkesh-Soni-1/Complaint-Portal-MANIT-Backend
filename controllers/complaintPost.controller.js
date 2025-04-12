import Complaints from "../models/complaint.model.js";

const generateComplainNumber = async () => {
  const count = await Complaints.countDocuments();
  const number = count + 1;
  return `CMP-${number.toString().padStart(4, "0")}`;
};

const complaintPostController = async (req, res) => {
  try {
    const complaintNumber = await generateComplainNumber();

    const newComplaint = new Complaints({
      ...req.body,
      complaintNumber,
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to create complaint", error });
  }
};

export default complaintPostController;
