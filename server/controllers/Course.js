const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUplader");
const Category = require("../models/category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const redisClient = require("../config/redis");
const { CACHE_TTL_SECONDS } = require("../config/cache");

// ─── Cache Config ───────────────────────────────────────
const CACHE_TTL = CACHE_TTL_SECONDS; // imported from config/cache.js
const CACHE_KEYS = {
  ALL_COURSES: "courses:all",
  courseById: (id) => `course:${id}`,
};

// ─── Helper: safe Redis get ──────────────────────────────────
const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`⚠️  Redis GET failed for key "${key}":`, err.message);
    return null; // fallback to DB silently
  }
};

// ─── Helper: safe Redis set ──────────────────────────────────
const setCache = async (key, value, ttl = CACHE_TTL) => {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
    console.log(`cached: ${key} (${ttl}s)`);
  } catch (err) {
    console.error(`cache set failed for "${key}":`, err.message);
  }
};

// ─── Helper: safe Redis delete ───────────────────────────────
const deleteCache = async (...keys) => {
  try {
    await redisClient.del(...keys);
    console.log(`cache cleared: ${keys.join(", ")}`);
  } catch (err) {
    console.error(`cache delete failed:`, err.message);
  }
};
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



    // 🗑️ Invalidate courses list cache since a new course was added
    await deleteCache(CACHE_KEYS.ALL_COURSES);

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//get all courses[]

exports.getAllCourses = async (req, res) => {
  try {
    // 1️⃣ Try Redis cache first
    const cached = await getCache(CACHE_KEYS.ALL_COURSES);
    if (cached) {
      console.log("courses served from cache");
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: cached,
      });
    }

    // 2️⃣ Cache miss — fetch from MongoDB
    const allCourses = await Course.find({});

    // 3️⃣ Store in Redis for next request
    await setCache(CACHE_KEYS.ALL_COURSES, allCourses);

    return res.status(200).json({
      success: true,
      fromCache: false,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch all courses",
    });
  }
};


//get ALL COURSE DETAILS

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    // ✅ Validate ObjectId before hitting MongoDB
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course ID: "${courseId}"`,
      });
    }

    const cacheKey = CACHE_KEYS.courseById(courseId);

    // 1️⃣ Try Redis cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`course ${courseId} served from cache`);
      return res.status(200).json({
        success: true,
        fromCache: true,
        message: "Course details fetched successfully",
        data: cached,
      });
    }

    // 2️⃣ Cache miss — fetch from MongoDB with full populate
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      //.populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Cannot find course with id: ${courseId}`,
      });
    }

    // 3️⃣ Store in Redis
    await setCache(cacheKey, courseDetails);

    return res.status(200).json({
      success: true,
      fromCache: false,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal server error while fetching course data",
    });
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

    // 🗑️ Invalidate both the list cache and this course's detail cache
    await deleteCache(CACHE_KEYS.ALL_COURSES, CACHE_KEYS.courseById(courseId));

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

    // 🗑️ Invalidate caches since course status changed
    await deleteCache(CACHE_KEYS.ALL_COURSES, CACHE_KEYS.courseById(courseId));

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