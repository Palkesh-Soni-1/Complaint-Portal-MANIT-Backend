import Complaints from "../models/complaint.model.js";

const getComplaintsByComplaintIdController = async (req, res) => {
  const { complaintId } = req.query;
  console.log(complaintId);
  try {
    const finalData = await Complaints.find({ _id:complaintId });
    // console.log(finalData);
    if(finalData.length<1) {
      res.status(400).json({ error: "Complaint not found" });
      return;
    }
    res.status(200).json({ data: finalData[0] });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
export default getComplaintsByComplaintIdController;
