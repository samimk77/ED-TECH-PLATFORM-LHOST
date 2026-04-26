const mongoose=require("mongoose")
const mailSender=require("../utils/mailSender")
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

//a fucntion to send email
async function sendVerficationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"Verficaltion mail",otp);
        console.log("email sent successfully",mailResponse);
        
        
    } catch (error) {
        console.log("error occured while sending mail",error);
        throw error;
        
    }
}
OTPSchema.pre("save", async function () {
  if (this.isNew) {
    await sendVerficationEmail(this.email, this.otp);
  }
});
module.exports=mongoose.model("OTP",OTPSchema)