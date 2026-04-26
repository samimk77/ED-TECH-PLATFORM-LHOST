import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import loginImg from "../assets/Images/login.webp";
import toast from "react-hot-toast";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import HighlightText from "../components/core/HomePage/HighlightText";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/profileSlice";
import { setToken } from "../slices/authSlice";



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");

    try {
    const res=  await apiConnector("POST", categories.LOGIN_API, { email, password });

      dispatch(setToken(res.data.token))
      dispatch(setUser(res.data.user))

      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
     

    console.log("AFTER DISPATCH:", res.data.token);

      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error);
      
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="w-11/12 flex gap-10 mx-auto ">
      <div className="flex flex-col w-[40%] p-18 ">
        <div className="text-4xl mt-10 mb-5">
          <HighlightText text={"Welcome Back"} />
        </div>
        <p className="text-richblack-50 ">
          {" "}
          Continue your learning for a better future tomorrow
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-row gap-3"></div>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-richblack-700 text-white"
          />

          <div className="flex flex-row gap-3">
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                className=" w-full p-3 rounded-md bg-richblack-700 text-white"
              />

              <span
                className="absolute text-white right-2 top-[30%] text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-yellow-300 text-black py-3 rounded font-semibold mt-4 hover:bg-yellow-400 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      {/* image   */}
      <div className="ml-40 mt-20 w-150">
        <img src={loginImg} />
      </div>
    </div>
  );
};

export default Login;
