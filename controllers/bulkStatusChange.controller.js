import Complaints from "../models/complaint.model.js";

const bulkStatusChangeController = async (req, res) => {
  try {
    const { complaintIds, status, feedback } = req.body;
    
    // Validation ---------------------------------------------
    if (
      !complaintIds ||
      !Array.isArray(complaintIds) ||
      complaintIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid complaint IDs are required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // For assigned status, validate adminId upfront
    if (status === "assigned") {
      const { adminId } = req.body;
      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }
    }

    // For processing or resolved status, validate feedback upfront
    if ((status === "processing" || status === "resolved") && !feedback) {
      return res.status(400).json({
        message: `${
          status === "processing" ? "Processing" : "Resolving"
        } feedback is required`,
      });
    }

    const updatedComplaints = [];

    // Use Promise.all to wait for all updates to complete
    await Promise.all(
      complaintIds.map(async (complaintId) => {
        const complaint = await Complaints.findById(complaintId);
        if (!complaint) {
          updatedComplaints.push({
            id: complaintId,
            updated: false,
            message: "Complaint not found",
          });
          return;
        }

        // Update status
        complaint.status = status;

        // Handle different status cases
        switch (status) {
          case "rejected":
            complaint.assigned = false;
            complaint.processed = false;
            complaint.resolved = false;
            complaint.assignedTo = null;
            complaint.processedBy = null;
            complaint.resolvedBy = null;
            break;

          case "assigned":
            const { adminId } = req.body;
            complaint.assigned = true;
            complaint.assignedTo = adminId;
            break;

          case "processing":
            complaint.processed = true;
            complaint.processedBy = req.admin._id;
            complaint.processingFeedback = feedback;
            break;

          case "resolved":
            complaint.resolved = true;
            complaint.resolvedBy = req.admin._id;
            complaint.resolvingFeedback = feedback;
            break;

          case "open":
            complaint.assigned = false;
            complaint.processed = false;
            complaint.resolved = false;
            complaint.assignedTo = null;
            complaint.processedBy = null;
            complaint.resolvedBy = null;
            break;
        }

        const savedComplaint = await complaint.save();
        updatedComplaints.push({
          id: complaintId,
          updated: true,
          complaint: savedComplaint,
        });
      })
    );

    res.status(200).json({
      message: `Successfully updated ${
        updatedComplaints.filter((c) => c.updated).length
      } complaints`,
      results: updatedComplaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to change status",
      error: error.message,
    });
  }
};

export default bulkStatusChangeController;
