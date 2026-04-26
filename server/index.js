require("dotenv").config();

const express=require("express")
const app=express();

app.use(express.urlencoded({ extended: true })); //iske wajah se profile pic change nahi horha tha ye add krna tha

const userRoutes = require("./routes/User")
const courseRoutes=require("../server/routes/Course")
const profileRoutes=require("../server/routes/Profile")
const paymentRoutes=require("../server/routes/Payment")
const contactRoutes=require("../server/routes/Contact")

const database=require("../server/config/database")
const cookieParser=require("cookie-parser")
const cors =require("cors")
const {cloudinaryConnect} =require("../server/config/cloudinary")
const fileUpload=require("express-fileupload")
const dotenv=require("dotenv")

const mailSender=require("../server/utils/mailSender")
const PORT=process.env.PORT || 4000;

//DATABASE
database.connect()

//MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:["http://localhost:3000",  //frontend url
        "https://ed-tech-platform-lhost.onrender.com",], // backend url
        credentials:true,
    })
)

const path = require("path");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "../tmp"),
  })
);

//connect cloudniary
cloudinaryConnect();


//routes
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/contact",contactRoutes)

//default route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is running"
    })
})

app.listen(PORT,()=>{
    console.log(`APP IS RUNNING ON PORT ${PORT}`);
    
})