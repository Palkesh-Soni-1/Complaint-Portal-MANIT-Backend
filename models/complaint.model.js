import mongoose from "mongoose";
const complaintSchema = mongoose.Schema(
  {
    complaintNumber: {
      type: String,
      unique: true,
    },
    studentId: String,
    studentName: String,
    hostelNumber: String,
    roomNumber: String,
    complaintType: String,
    complaintSubType: String,
    description: String,
    dateReported: String,
    attachments: [String],
    
    status: {
      type: String,
      default: "open",
    },

    processed: {
      type: Boolean,
      default: false,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    processingFeedback: String,

    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    resolvingFeedback: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Complaints =  mongoose.model("Complaints",complaintSchema);
export default Complaints;