import Complaints from "../models/complaint.model.js";

const getAssignedComplaintsController = async (req, res) => {
  const { adminId } = req.query;
  if (!adminId) {
    res.status(400).json({ err: err });
  }
  try {
    const finalData = await Complaints.find({assignedTo:adminId}).sort({ createdAt: -1 });
    res.status(200).json({ data: finalData });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
export default getAssignedComplaintsController;
