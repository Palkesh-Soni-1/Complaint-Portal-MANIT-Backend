import Complaints from "../models/complaint.model.js";

const statusChangeController = async (req, res) => {
  try {
    const {complaintId,status} = req.body;
    const complaint = await Complaints.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.status = status;
    const savedComplaint=await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to change status", error });
  }
};

export default statusChangeController;
