const Course=require("../models/Course")
const Section=require("../models/Section")

exports.createSection=async(req,res)=>{
   try {
     //fetch data
    const {sectionName}=req.body;
    const {courseId}=req.params;
    //validate
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"missing properties"
        })
    }
    //create section
    const newSection=await Section.create({sectionName})
    //update course with section object ID
    const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                        courseId,
                                                        {
                                                            $push:{
                                                                courseContent:newSection._id,
                                                            }
                                                        },
                                                        {new:true},
                                                    )

     
     //populate section ans subsection                                               )
    //return res
    return res.status(200).json({
        success:true,
        message:"section created successfully",
        updatedCourseDetails,
    })
    
   } catch (error) {
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"error in creating section", 
      
    })
    
    
   }
}

//update existing section matlab section ko edit krne wala function
exports.updateSection=async(req,res)=>{
    try {
        //get existing section name 
        const {sectionName}=req.body;
        const {sectionId}=req.params;
        //validate
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"section is not valid"
            })
        }
        //update the section
        const updatedSection= await Section.findByIdAndUpdate(
                                                            sectionId,
                                                            {
                                                                sectionName,
                                                            },
                                                            {
                                                                new:true,
                                                            }
        )
        
        return res.status(200).json({
            success:true,
            message:"section details updated successfully",
        })

    } catch (error) {
        console.log(error);
    return res.status(400).json({
        success:false,
        message:"error in updating section", 
    })
}



}


//delete section

exports.deleteSection=async(req,res)=>{
 try {
    //get ID ->assuming we are sending id in params
       const {sectionId,courseId}=req.params
    
   await Section.findByIdAndDelete(sectionId)

   await Course.findByIdAndUpdate(courseId, {
  $pull: { courseContent: sectionId }
});

    return res.status(200).json({
        success:true,
        message:"section deleted successfully"
    })
    
 } catch (error) {
    console.log(error);
    
        return res.status(400).json({
            success:false,
            message:"error while deleting section ",
            message:error.message
        })
    }
    
 }
