const mailSender=require("../utils/mailSender");


exports.contactUs=async(req,res)=>{
    try {


        const {firstName ,lastName,email,contactNumber,message}=req.body;

        if(!firstName || !lastName || !email || !contactNumber ||!message){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }

        //send meesage to admin
       await mailSender(  
                          process.env.MAIL_USER,
                         "NEW MESSAGE FEEDBACK",
                                            `
                         Name:${firstName} ${lastName}
                        Email:${email},
                        Phone:${contactNumber},
                        Message:${message},
                        `
                        )
        //send confirmation message to user
        await mailSender(
            email,
            "Message received",
            `Hi ${firstName} we have received your message. Well get back to u soon !`

        )
        return res.status(200).json({
            success:true,
            message:"feedback mail sent seccuessfully",
        })
                                            
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot send ffedback mail internal error"
        })
        
        
    }
}