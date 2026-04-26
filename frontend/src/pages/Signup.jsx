import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { IoMdEyeOff } from "react-icons/io"; 
import { IoEye } from "react-icons/io5";  
import toast from "react-hot-toast";
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { useNavigate } from "react-router-dom";
import HighlightText from '../components/core/HomePage/HighlightText';
import signUpImg from "../assets/Images/signup.webp"

const Signup = ()=>{

const navigate = useNavigate();


    const [accountType,setAccountType]=useState("Student");

    const [formData,setFormData]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:"",
    })


const [showPassword,setShowPassword] = useState(false)
const [showConfirmPassword,setShowConfirmPassword] = useState(false)

const {firstName,lastName,email,password,confirmPassword} = formData

const handleChange=(e)=>{
    setFormData({...formData, [e.target.name] : e.target.value})
}


const handleSubmit=async(e)=>{
    e.preventDefault();

    if(password!==confirmPassword){
        toast.error("Password mismatch")
    }

  const toastId = toast.loading("Creating account...");
   
  try {
    // 1. CALL SEND OTP API
    await apiConnector(
      "POST",
      categories.SEND_OTP_API,
      { email }
    );

    // 2. STORE DATA TEMPORARILY
    localStorage.setItem(
      "signupData",
      JSON.stringify({ ...formData, accountType })
    );

    toast.success("OTP Sent");

    // 3. REDIRECT TO OTP PAGE
    navigate("/verify-email");

  } catch (error) {
    console.log("OTP error", error);
    toast.error(error.response?.data?.message || "Signup failed");
  } finally {
    toast.dismiss(toastId);
  }
};



 return (
    <div className='w-11/12 flex gap-10 mx-auto '>

        <div className='flex flex-col w-[40%] p-8 '>

                <div className='text-4xl mt-10 mb-5'>
        <HighlightText text={" Join the millions learning to code with StudyNotion for free"}/>

        </div>
        <p className='text-richblack-50 '>  Build skills for today, tomorrow, and beyond.</p>


        <div className='flex flex-row  justify-around w-[45%] bg-richblack-800 px-1.5 py-1.5 gap-3 rounded-full mt-10 mb-10 '>

            <button
             onClick={()=>setAccountType("Student")}
             className={`px-4 py-2 rounded-full cursor-pointer  ${accountType==="Student" ? "bg-richblack-900 text-white" : "text-richblack-100"}`}
             >Student</button>

              <button
             onClick={()=>setAccountType("Instructor")}
             className={`px-4 py-2 rounded-full cursor-pointer  ${accountType==="Instructor" ? "bg-richblack-900 text-white" : "text-richblack-100"}`}
             >Instructor</button>

        </div>



        
        <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
            <div className='flex flex-row gap-3'>

            <input
                type='text'
                name="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleChange}
                className='w-full p-3 rounded-md bg-richblack-700 text-white'
            />

            <input
                type='text'
                name="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleChange}
                className='w-full p-3 rounded-md bg-richblack-700 text-white'
            />

          

            </div>

              <input
                type='email'
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                className='w-full p-3 rounded-md bg-richblack-700 text-white'
            />

            <div className='flex flex-row gap-3'>

                <div className='w-full relative'>
                 <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                className=' w-full p-3 rounded-md bg-richblack-700 text-white'
            />

              <span
            className='absolute text-white right-2 top-[30%] text-xl'
            onClick={()=>setShowPassword(!showPassword) }
            >{showPassword ?<IoMdEyeOff/> :<IoEye/> }</span>


                </div>
           

          <div className='relative w-full'>
            <input
                type={showConfirmPassword ? "text" :"password" }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                className='w-full p-3 rounded-md bg-richblack-700 text-white'
            />

            <span
            className='absolute text-white right-2 top-[30%] text-xl'
            onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
            >{showConfirmPassword ? <IoMdEyeOff/> : <IoEye/>}</span>

          </div>
            

            </div>
            <button
            type="submit"
            className="bg-yellow-300 text-black py-3 rounded font-semibold mt-4 hover:bg-yellow-400 cursor-pointer"
          >
            Create Account
          </button>


        </form>

        </div>


        {/* image   */}
        <div className='ml-40 mt-20 w-150'>
            <img src={signUpImg}/>
        </div>
        
    </div>

  );
}


export default Signup