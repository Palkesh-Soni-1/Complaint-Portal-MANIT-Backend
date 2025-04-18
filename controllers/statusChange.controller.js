import Complaints from "../models/complaint.model.js";

const statusChangeController = async (req, res) => {
  try {
    const { complaintId, status, feedback } = req.body;

    const complaint = await Complaints.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update status
    complaint.status = status;

    // Handle processing status
    if (status === "processing") {
      if (!feedback) {
        return res
          .status(400)
          .json({ message: "Processing feedback is required" });
      }

      complaint.processed = true;
      complaint.processedBy = req.admin._id;
      complaint.processingFeedback = feedback;
    }

    // Handle closed status
    if (status === "closed") {
      if (!feedback) {
        return res
          .status(400)
          .json({ message: "Closing feedback is required" });
      }

      complaint.closed = true;
      complaint.closedBy = req.admin._id;
      complaint.closingFeedback = feedback;
    }

    const savedComplaint = await complaint.save();
    res.status(200).json(savedComplaint);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to change status", error: error.message });
  }
};

export default statusChangeController;
