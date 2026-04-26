const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUplader");
const Category = require("../models/category");
const Section =require("../models/Section")
const SubSection=require("../models/SubSection")
//create course
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    //validate
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructor details : ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "instructor details not found",
      });
    }
    //CHECK IF GIVEN Category IS VALID
    const categoryDetails = await Category.findById(category); 

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "categoryDetails details not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME,
    );

    //create entry for newcourse
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      instructor: instructorDetails._id,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add the new course to user schema of instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

  const updatedCategory = await Category.findById(categoryDetails._id);

updatedCategory.courses.push(newCourse._id);

await updatedCategory.save();



    //return res
    return res.status(200).json({
      success: true,
      message: "course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to create course",
      error: error.message,
    });
  }
};

//get all courses[]

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({});
    return res.status(200).json({
  success: true,
  data: allCourses,
});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "cannot fetch all courses",
    });
  }
};


//get ALL COURSE DETAILS

exports.getCourseDetails=async(req,res)=>{

  try {
    
    //get id
    const {courseId}=req.params;

    //find course details
    const courseDetails = await Course.find(
                                           {_id:courseId}).populate(
                                            {
                                              path:"instructor",
                                              populate:{
                                                path:"additionalDetails"
                                              }
                                            }
                                            )
                                            .populate("category")
                                            //.populate("ratingAndReview")
                                            .populate({
                                              path:"courseContent",
                                              populate:{
                                                path:"subSection",
                                              }
                                            })
                                            .exec();

              //validation
              if(!courseDetails){
                return res.status(400).json({
                  success:false,
                  message:`cannot find course with ${courseId}`,
                })
              }  
              
              return res.status(200).json({
                success:true,
                message:"course details fetched succcessfully",
                data:courseDetails,
              })
    
    
        } catch (error) {
          console.log(error);
          return res.status(400).json({
            success:false,
            message:"internal server error while fetching course data"
          })
          
    
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // ✅ VALIDATE FIRST
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const sections = courseDetails.courseContent;

    // ✅ GET ALL SECTIONS AT ONCE
    const sectionDocs = await Section.find({ _id: { $in: sections } });

    // ✅ COLLECT ALL SUBSECTION IDS
    const allSubsections = sectionDocs.flatMap(
      (section) => section.subSection || []
    );

    // ✅ DELETE ALL SUBSECTIONS
    await SubSection.deleteMany({ _id: { $in: allSubsections } });

    // ✅ DELETE ALL SECTIONS
    await Section.deleteMany({ _id: { $in: sections } });

    // ✅ DELETE COURSE
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.log("DELETE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // 🔥 OPTIONAL VALIDATION (recommended)
    const course = await Course.findById(courseId).populate("courseContent");

    if (!course || course.courseContent.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one section before publishing",
      });
    }

    // 🔥 UPDATE STATUS
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { status: "Published" },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish course",
    });
  }
};