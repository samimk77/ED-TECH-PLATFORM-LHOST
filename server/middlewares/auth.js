const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config()

//auth
exports.auth = async (req, res, next) => {
  try {
    //token laao
     const authHeader = req.headers.authorization;

      const token =
      (req.body && req.body.token) ||   // ✅ safe check
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    //if token is missing
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token missing",
      });
    }

    //verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode; // sirf request ke andar temporary store krrhe taaki req.user.id , req.user.role yesb use krpae
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "something went wrong token cannot be validated",
    });
  }
};

//isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "access denied, role is not student",
      });
    }

    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Role cannot be verified , try again",
    });
  }
};

//isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "access denied, user is not Instructor",
      });
    }
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Role cannot be verified , try again",
    });
  }
};

//isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "access denied, user is not Admin",
      });
    }
    next();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Role cannot be verified , try again",
    });
  }
};
