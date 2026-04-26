const User = require("../models/User")

exports.getAllStudents=async(req,res)=>{
    try {
        const students = await User.find({accountType:"Student"})
        .populate("additionalDetails")
        .select("-password") //dont select password

        return res.status(200).json({
            success:true,
            message:"All students fetched successfully",
            students,
            count:students.length
        })
        
    } catch (error) {
        console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
    
        
    }
}




exports.getAllInstructors=async(req,res)=>{
    try {
        const instructors = await User.find({accountType:"Instructor"})
        .populate("additionalDetails")
        .select("-password") //dont select password

        return res.status(200).json({
            success:true,
            message:"All instructor fetched successfully",
            instructors,
            count:instructors.length
        })
        
    } catch (error) {
        console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructors",
    });
    
        
    }
}
