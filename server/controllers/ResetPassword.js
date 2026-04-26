const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//resetPasswordToken   //ek unique token aadd krege link ke end me taaki har user ke liye unique link generate ho

exports.resetPasswordToken = async (req, res) => {
  try {
    //get email
    const email = req.body.email;
    //validate email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "email not registered",
      });
    }
    //generate token
    const token = crypto.randomUUID(); //this method is used to generate a random unique id UUID-> UNIVERSALLY UNIQUE IDENTIFIER
    //update user by adding token and expiration time
    console.log("token is :",token);
    
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }, //updated details res me return hojaega
    ); 
    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing url
    await mailSender(email, "PASSWORD RESET LINK", `LINK: ${url}`);
    //return response
    return res.json({
      success: true,
      message: "email sent successfully,check your email for link",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "something went wrong while resetting password",
    });
  }
};

//actual me ab password reset kro

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validate
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "passwords dont match",
      });
    }
    //get userdetails from db using token
    const userDetails = await User.findOne({ token: token });
    //if no entry- invalid token
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "token invalid",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token is expired, regenrate ur token",
      });
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    //update passwod
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true },
    );
    //return res
    return res.status(200).json({
      success: true,
      message: "password reset successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error while resetting password",
    });
  }
};
