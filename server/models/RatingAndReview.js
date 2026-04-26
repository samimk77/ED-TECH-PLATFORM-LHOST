const mongoose=require("mongoose")

const ratingAndReview=new mongoose.Schema({
    user:{  //user is field name & User is model name
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
       type:String,
       required:true, 
    }
})

module.exports=mongoose.model("RatingAndReview",ratingAndReview)