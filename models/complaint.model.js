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

    assigned: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intermediate",
    },

    status: {
      type: String,
      default: "open",
      enum: ["open", "processing", "resolved", "assigned", "rejected"],
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

    rejected: {
      type: Boolean,
      default: false,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intermediate",
    },
    rejectingFeedback: String,

    isStudentFeedback:{
      type:Boolean,
      default:false
    },
    studentFeedback:{
      type:String
    },

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