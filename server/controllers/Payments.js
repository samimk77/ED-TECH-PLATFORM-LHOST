const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");


// ==============================
// CAPTURE PAYMENT
// ==============================
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No courses provided",
    });
  }

  let totalAmount = 0;

  for (const courseId of courses) {
    try {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Course not found",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "User already enrolled in course",
        });
      }

      totalAmount += course.price;

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: paymentResponse,
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Cannot initiate Razorpay order",
    });
  }
};


// ==============================
// VERIFY PAYMENT
// ==============================
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed (missing data)",
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid signature, payment failed",
    });
  }

  try {
    await enrollStudents(courses, userId);

    return res.status(200).json({
      success: true,
      message: "Enrollment successful",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// ENROLL STUDENTS
// ==============================
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Courses or userId missing");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  for (const courseId of courses) {

    // update course (add student)
    const enrolledCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          studentsEnrolled: userId,
        },
      },
      { new: true }
    );

    if (!enrolledCourse) {
      throw new Error("Course not found");
    }

    // update user (add course)
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courses: courseId,
        },
      }
    );

    // send email
    await mailSender(
      user.email,
      `Successfully enrolled in ${enrolledCourse.courseName}`,
      `You have been successfully enrolled in ${enrolledCourse.courseName}.`
    );
  }

  return true;
};