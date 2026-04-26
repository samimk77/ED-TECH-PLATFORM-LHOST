const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenrator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender=require("../utils/mailSender")
const Profile=require("../models/Profile")

//sendotp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from body
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "user already exits",
      });
    }

    //if user not present then generate OTP
    var otp = otpGenrator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp is : ", otp);

    //we need only unique otp so check in DB
    const result = await OTP.findOne({ otp: otp });
    //database wala otp : abhi generate kiya hua  otp
    while (result) {
      var otp = otpGenrator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //create entry in DB
    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);

    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log("error while logging in", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup

exports.signUp = async (req, res) => {
  try {
    //fetch data from body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    //validate the user
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    //confirm password
    if (password !== confirmPassword) {
      return res.json(400).json({
        success: false,
        message: "passwords dont match",
      });
    }
    //check if user already exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        messsage: "user already exists",
      });
    }
    //find most recent otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1); //-1 MEANS DECSENDING ORDER LATEST->OLDEST



    //validate otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "otp not found",
      });
    } else if (otp !== recentOtp[0].otp.toString()) {
      return res.status(400).json({
        success: false,
        messgae: "otp does not match",
      });
    }

    //hash th epassword
    const hashedPassword = await bcrypt.hash(password, 10);

    let approved="";
    approved==="Instrcutor" ?(approved=false):(approved=true);

    //make the additional details schmea
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      about: null,
    });
    //store the info in DB 
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      approved:approved,
      additionalDetails: profileDetails,
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${firstName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error) {
    console.log("error occured in signup", error);
    return res.status(500).json({
      success: false,
      message: "error while creating account",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "enter both email and password for login",
      });
    }
    const user = await User.findOne({ email }).populate("additionalDetails"); //user ka sara ka sara details aaega populate hoke

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not registered",
      });
    }

    //match password and geerate jwt token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      //create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "logged in successfully ",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in loggin in",
    });
  }
};


//changepassword

exports.changePassword = async (req, res) => {
  try {
    //get data from body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    //validate
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "updated passwords dont match",
      });
    }

    //fetch user from token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user does not exits",
      });
    }

    //check the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "oldPasswors is incorrect",
      });
    }

    //oldpasssword and newone cannnot be same
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

   
    //before updated hash it

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    //update the password
    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in updating password",
    });
  }
};
