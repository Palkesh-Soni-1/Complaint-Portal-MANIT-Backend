import Complaints from "../models/complaint.model.js";

const getComplaintsByComplaintNumberController = async (req, res) => {
  const { complaintNumber } = req.query;
  console.log(complaintNumber);
  try {
    const finalData = await Complaints.find({ complaintNumber });
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
export default getComplaintsByComplaintNumberController;
