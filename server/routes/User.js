// Import the required modules
const express = require("express")
const router = express.Router()


console.log("User routes loaded");
// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")


const {
  getAllStudents,
  getAllInstructors,
} =require("../controllers/User")

const { auth,isAdmin } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/otp", sendOTP)

// Route for Changing the password
router.post("/password", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


//ROUTR TO GET ALL STUDENTS AND INSTRUCTORS

router.get("/students",auth,isAdmin,getAllStudents)
router.get("/instructors",auth,isAdmin,getAllInstructors)

router.get("/test", (req, res) => {
  res.send("WORKING");
});


// Export the router for use in the main application
module.exports = router