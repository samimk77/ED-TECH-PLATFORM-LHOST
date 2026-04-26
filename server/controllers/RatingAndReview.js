const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
  try {
    //get userid
    const userId = req.user.id;

    //fetch data from req body
    const { rating, review, courseId } = req.body;
    //check if user is enrolled in the course
    const checkIsUserEnrolled = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!checkIsUserEnrolled) {
      return res.status(404).json({
        success: false,
        message: "user not enrolled , cannot give review",
      });
    }

    //check if user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId, //agar inn dono data ke saath koi bhi entry padi ho then rating has been done by user
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "user has already reviewed the course",
      });
    }

    //create review and rating
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });
    //update course with this review
    const updatedCourseDetailsWithReview = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id, //Course db me ratingAndReview object ke form me hai toh push krte time _id likhna hoga coz hum object paas kregege string nahi
        },
      },
      { new: true },
    );
    console.log(updatedCourseDetailsWithReview);

    //return response
    return res.status(200).json({
      success: true,
      message: "rating and review created successsfully",
      data: ratingReview,
    });
  }
   catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
        message:"error while creating rating"
    })
  }
};





//get average rating
exports.getAverageRating = async (req, res) => {
 try {
       const courseId = req.query.courseId;

    //calc avg rating

    const result = await RatingAndReview.aggregate([
      {
        $match: {
             course: new mongoose.Types.ObjectId(courseId) 
            },
      },
      {
        $group: {
            _id: null, //sbko ek hi group me daaldo
            avgRating: { $avg: "$rating" },
            },
     
      },
    ]);
    ///return rating
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating //  aggregate function ek array return krta hai for example->
                                                //     result = [
                                                //               {
                                                //                _id: null,
                                                //                 averageRating: 4.2
                                                //               }
                                                //            ];
                                                 
             
    })
}
//if no rating exists 

return res.status(200).json({
    success:true,
    message:"avg rating is 0 for now , no ratings given",
    avgRating:0,
})
    
 } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })
    
    
 }
};






//get all rating

exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
        .sort({rating:"desc"}).populate({
        path:"user",  //field name use krte hai isliye small u ie user and not User (captital U) 
         select:"firstName lastName email image"  //yesb field ko populate krne hai toh isko select ke andar daaldo
        })
        .populate({
            path:"course",
            select:"courseName"
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allReviews,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
        

    }
}

