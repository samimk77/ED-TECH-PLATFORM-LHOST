const SubSection=require("../models/SubSection")
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUplader");

exports.createSubSection=async(req,res)=>{
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    try {
        const{title,description}=req.body
        const {sectionId} = req.params;

        const video=req.files.videoFile;

        if(!sectionId || !title || !description ){
            return res.status(400).json({
                success:false,
                message:"subsections fields are missing",
            })

            
        }
        //upload video to cloudinaary

        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        //CREATE SUBSECTION
        const subSectionDetails=await SubSection.create(
            {
                title:title,
                description:description,
                videoUrl:uploadDetails.secure_url,
            }
        )

        //update section with this subsection objefctId
        
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
                                                              {
                                                                $push:{
                                                                    subSection:subSectionDetails._id,
                                                                }
                                                              },
                                                              {new:true}) //ye krne se updated documnet milega
                                                               .populate("subSection")
                                                               .exec();                                     
            console.log((updatedSection));
                                                                

        return res.status(200).json({
            success:true,
            message:"subsection created successfully",
            updatedSection,
        })

    } catch (error) {
        console.log(error);
        
         return res.status(400).json({
                success:false,
                message:"internal server error subsections creation not successfull",
            })
    }
}

//updateSubsection
exports.updateSubSection=async(req,res)=>{
    try {
        //fetch data
        const {title,description}=req.body
        const {subSectionId} = req.params;
        //validate
        if(!subSectionId || !title || !description){
            return res.status(400).json({
                success:false,
                message:"subsection fields are missing , cannot update them"
            })
        }
        //update
        const updatedSubSection=await SubSection.findByIdAndUpdate(
                                                                    subSectionId,
                                                                    {
                                                                        title,
                                                                        description,
                                                                       

                                                                    },
                                                                    {new:true}

                                                                )
            return res.status(200).json({
                success:true,
                message:"subsection updated successfully",
                data:updatedSubSection,
            })

        
    } catch (error) {
        console.log(error);
        
          
         return res.status(400).json({
                success:false,
                message:"internal server error subsection cannot be updated",
            })
        
    }
}


///deleteSubsection

exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.params;

    // 🔥 VALIDATION
    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing sectionId or subSectionId",
      });
    }

    // 🔥 REMOVE FROM SECTION FIRST
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // 🔥 DELETE SUBSECTION
    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });

  } catch (error) {
    console.log("DELETE SUBSECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection",
    });
  }
};