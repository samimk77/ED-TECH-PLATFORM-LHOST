const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getAllEnrolledCourses,
  //getEnrolledCourses,
  //instructorDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/", auth, deleteAccount)
router.put("/", auth, updateProfile)
router.get("/", auth, getAllUserDetails)
// Get Enrolled Courses
//router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/display-picture", auth, updateDisplayPicture)
//router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get("/enrolled-courses",auth,getAllEnrolledCourses)
module.exports = router