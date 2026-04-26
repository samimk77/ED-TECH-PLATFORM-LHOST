const mongoose=require("mongoose")

const courseSchema= new mongoose.Schema({

    courseName:{
        type:String,
          required:true,
    },
    courseDescription:{
        type:String,
          required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
        default: [],
    }],
    price:{
        type:Number,
        required:true,
    },
    thumbnail:{
        type:String,
          required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
          required:true,
    },
    tag:{
        type:[String],
        required:true,
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
      
        ref:"User",
        default: [],
    }],

    sold: {
    type: Number,
    default: 0,
    },
    instructions:{
        type:[String],
        
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    }

}
    
)

module.exports=mongoose.model("Course",courseSchema)