// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  //getFullCourseDetails,
  //editCourse,
  //getInstructorCourses,
  deleteCourse,
  publishCourse,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  showAllCategory,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")

// const {
//   updateCourseProgress
// } = require("../controllers/courseProgress");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/categories", auth, isAdmin, createCategory)
router.get("/categories", showAllCategory)
router.get("/categories/:categoryId", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/ratings", auth, isStudent, createRating)
router.get("/ratings/average", getAverageRating)
router.get("/ratings", getAllRating)

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/", auth, isInstructor, createCourse)
// Get all Registered Courses
router.get("/", getAllCourses)

// Get Details for a Specific Courses
router.get("/:courseId", getCourseDetails)
// Delete a Course
router.delete("/:courseId", deleteCourse)
// Publish Course
router.patch("/:courseId/publish", publishCourse)

//Add a Section to a Course
router.post("/:courseId/sections", auth, isInstructor, createSection)
// Update a Section
router.put("/:courseId/sections/:sectionId", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/:courseId/sections/:sectionId", auth, isInstructor, deleteSection)

// Add a Sub Section to a Section
router.post("/:courseId/sections/:sectionId/subsections", auth, isInstructor, createSubSection)
// Edit Sub Section
router.put("/:courseId/sections/:sectionId/subsections/:subSectionId", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.delete("/:courseId/sections/:sectionId/subsections/:subSectionId", auth, isInstructor, deleteSubSection)

module.exports = router