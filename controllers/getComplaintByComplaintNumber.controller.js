import Complaints from "../models/complaint.model.js";

const getComplaintsByComplaintNumberController = async (req, res) => {
  const { complaintNumber } = req.query;
  try {
    const finalData = await Complaints.find({ complaintNumber });
    res.status(200).json({ data: finalData });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
export default getComplaintsByComplaintNumberController;
