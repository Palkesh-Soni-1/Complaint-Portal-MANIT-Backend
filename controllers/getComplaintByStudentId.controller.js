import Complaints from "../models/complaint.model.js";

const getComplaintsByStudentIdController = async (req,res) =>{
    const {studentId} = req.query;
    try{
        const finalData = await Complaints.find({ studentId }).sort({
          createdAt: -1,
        });
        res.status(200).json({data:finalData});
    }
    catch(err){
        res.status(500).json({err:err});
    }
}
export default getComplaintsByStudentIdController