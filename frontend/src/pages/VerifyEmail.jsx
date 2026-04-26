import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import OTPInput from "../components/core/HomePage/Auth/OTPInput";
import CTAButton from "../components/core/HomePage/CTAButton";
import HighlightText from "../components/core/HomePage/HighlightText";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";




const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const signupData = JSON.parse(localStorage.getItem("signupData"));

    if (!signupData) {
      toast.error("Session expired");
      return;
    }

    try {
      await apiConnector(
        "POST",
        categories.SIGNUP_API,
        {
          ...signupData,
          otp: otp,
        }
      );

      toast.success("Account Created");
      localStorage.removeItem("signupData");

      navigate("/login");

    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  const handleBack=()=>{
    navigate("/signup")
  }

  const resentOTP=async ()=>{

    const signupData = JSON.parse(localStorage.getItem("signupData"))

    if(!signupData){
        toast.error("Session Expired")
        return;
    }

    const toastId=toast.loading("Resending OTP...")

    try {

        await apiConnector(
            "POST",
            categories.SEND_OTP_API,
            {email:signupData.email}
            

        )

        toast.success("OTP Resent")
        
    } catch (error) {
        toast.error("Failed to resend OTP");
        
    }
    finally {
    toast.dismiss(toastId);
  }
  }

  return (
    <div className="w-11/12 flex flex-col items-center  text-white mx-auto">

        <div className="text-4xl mt-20 font-bold mb-10">
        <HighlightText text={"Verify your OTP "}/>

        </div>
        <p className="mb-10">A verification code has been sent to you. Enter the code below</p>

        <div className="mt-15 w-fit">
         <OTPInput setOtp={setOtp}/>

            <div onClick={handleVerify} className="mt-10">
         <CTAButton children={"Verify otp"} active={true}  />

            </div>


            <div className="flex items-center justify-between mt-5">

            <div onClick={handleBack}  className="flex items-center cursor-pointer gap-1">
                <IoMdArrowRoundBack/>
                <p>Back to signup</p>
            </div>

            <div onClick={resentOTP} className="flex items-center cursor-pointer gap-1">
            <GiAnticlockwiseRotation/>
            <p>Resend OTP</p>
            </div> 

            </div>

        </div>
    </div>
  );
};

export default VerifyEmail;