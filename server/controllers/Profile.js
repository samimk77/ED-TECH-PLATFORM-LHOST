//hume profile update krna hai create nahi kyonki profile ka model already 
//bana ke null set krchuke in Auth.js line 134

const Profile = require("../models/Profile")
const User=require("../models/User")
const Course=require("../models/Course")
const {uploadImageToCloudinary}=require("../utils/imageUplader")

exports.updateProfile=async(req,res)=>{
    try {
        //get data
        const {gender,dateOfBirth="",contactNumber,about="",firstName="",lastName=""}=req.body  //jo optional hai usko ="" krke likhe hai

        const id=req.user.id;  //isko iss tarah se fetch krpaarhe coz auth.js me req.user=decode daal rkha hai

        if(!id|| !gender  || !contactNumber ){
            return res.status(400).json({
                success:false,
                message:"all fields are required to update profile"

            })
        }

        const updatedUserDetails = await User.findByIdAndUpdate(
            id,
            {firstName,lastName},
            {new:true}
        )

        //get profileID
    


        const profileId = updatedUserDetails.additionalDetails

       

       await Profile.findByIdAndUpdate(
                                                    profileId,
                                                    {
                                                        gender,
                                                        dateOfBirth,
                                                        contactNumber,
                                                        about,
                                                      
                                                    },
                                                    {new:true},

                                                    )


       const user=await User.findById(id).populate("additionalDetails")

          return res.status(200).json({
            success:true,
            message:"profile details updated successfully",
            user:user,
          })                                          
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating profile",
        })
        

    }
}

//delete account

exports.deleteAccount = async (req, res) => {
  try {
    const requestedUserId = req.query.userId; // from frontend
    const loggedInUserId = req.user.id;
    const role = req.user.accountType;

    // ❗ STRICT LOGIC
    let targetUserId;

    if (role === "Admin") {
      // admin MUST provide userId
      if (!requestedUserId) {
        return res.status(400).json({
          success: false,
          message: "UserId is required for admin delete",
        });
      }

      targetUserId = requestedUserId;
    } else {
      // normal user can only delete themselves
      targetUserId = loggedInUserId;
    }

    // ❌ PREVENT ADMIN SELF DELETE (VERY IMPORTANT)
    if (role === "Admin" && targetUserId === loggedInUserId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete themselves",
      });
    }

    const userDetails = await User.findById(targetUserId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;

    // remove from courses
    await Course.updateMany(
      { studentsEnrolled: targetUserId },
      { $pull: { studentsEnrolled: targetUserId } }
    );

    // delete profile
    if (profileId) {
      await Profile.findByIdAndDelete(profileId);
    }

    // delete user
    await User.findByIdAndDelete(targetUserId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get allUserDetails
exports.getAllUserDetails=async(req,res)=>{
    try {
        const id=req.user.id
        const userDetails=await User.findById(id).populate("additionalDetails").exec()

        return res.status(200).json({
            success:true,
            message:"ALL user data fetched successfully",
            data:userDetails,
        })
    } catch (error) {
            console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching user data"
        })
        
    }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture=req.files.displayPicture;
    const userId=req.user.id;
    //upload new image to cloudinary
    const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
    )
    console.log(image);

    const updatedProfile=await User.findByIdAndUpdate(
        {_id:userId},
        {image:image.secure_url},
        {new:true},
    )

   return res.status(200).json({
    success:true,
    message:"Profile pic updated successfully",
    user: updatedProfile,
   })
    
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"error in uploading profile pic"
    })
    
    
  }
    
}

exports.getAllEnrolledCourses=async(req,res)=>{

    try{
        const userId = req.user.id;

    if(!userId){
        return res.status(400).json({
            success:false,
            messgae:"user not found "
        })
    }

    const allEnrolledCourses= await User.findById(userId)
    .populate({
        path:"courses",
    });
    if(!allEnrolledCourses){
        return res.status(400).json({
            successs:false,
            message:"cannot get enrolled courses"
        })
    }
    return res.status(200).json({
        success:true,
        message:"all courses fetched successfully",
        courses:allEnrolledCourses.courses,
    })
    console.log(allEnrolledCourses.courses);
    
    }
    catch(error){
        console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching enrolled courses",
    });
    }

    
}