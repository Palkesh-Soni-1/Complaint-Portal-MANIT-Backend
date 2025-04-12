import mongoose from "mongoose";
const complaintSchema=mongoose.Schema({
    complaintNumber:{
      type:String,
      unique:true
    },
    studentId:String,
    studentName:String,
    hostelNumber:String,
    roomNumber: String,
    complaintType:String,
    complaintSubType: String,
    description:String,
    dateReported:String,
    attachments:[String],
    status:{
        type:String,
        default:"open"
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