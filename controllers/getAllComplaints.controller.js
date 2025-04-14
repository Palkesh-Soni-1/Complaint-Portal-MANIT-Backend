import Complaints from "../models/complaint.model.js";

const getAllComplaintsController = async (req,res) =>{
    try{
        const finalData = await Complaints.find().sort({ createdAt: -1 });
        res.status(200).json({data:finalData});
    }
    catch(err){
        res.status(500).json({err:err});
    }
}
export default getAllComplaintsController