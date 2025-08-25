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

    if(status==="rejected"){
      complaint.rejected=true;
      complaint.rejectionFeedback=feedback;
      complaint.rejectedBy=req.intermediate._id;
      const savedComplaint = await complaint.save();
      res.status(200).json(savedComplaint);
    }

    if(status==="assigned"){
      const {adminId} = req.body;
      if(!adminId){
        return res
          .status(400)
          .json({ message: "Admin Id is required" });
      }
      complaint.assigned = true;
      complaint.assignedTo = adminId;
      const savedComplaint = await complaint.save();
      res.status(200).json(savedComplaint);
    }

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
    if (status === "resolved") {
      if (!feedback) {
        return res
          .status(400)
          .json({ message: "Resolving feedback is required" });
      }

      complaint.resolved = true;
      complaint.resolvedBy = req.admin._id;
      complaint.resolvingFeedback = feedback;
    }

    if(status === "open"){
      complaint.assigned = false;
      complaint.processed = false;
      complaint.resolved = false;
      complaint.assignedTo=null;
      complaint.processedBy=null;
      complaint.resolvedBy=null;
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
