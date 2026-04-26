import React from 'react'
import Sidebar from './Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HighlightText from '../core/HomePage/HighlightText'


const Dashboard = () => {

  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const navigate=useNavigate();

  const isInstructor=user?.accountType==="Instructor"
  const isAdmin=user?.accountType==="Admin"

  return (
    <div className='w-full flex flex-row mx-auto h-[calc(100vh-65px)] overflow-hidden'>

      <Sidebar/>

      <div className="flex-1 overflow-y-auto p-6">

        {/* SHOW ONLY ON /dashboard */}
     {location.pathname === "/dashboard" && (
  <div className="flex flex-col items-center justify-center text-center mb-10 mt-40 gap-4">

    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
      Hi  <HighlightText text={`${user?.firstName} `} />, Welcome Back 👋
    </h1>

      {
        isInstructor ? (
              <p className="text-richblack-300 text-lg">
      Continue publishing new courses 🚀
    </p>
        ) : isAdmin ?  (
     <p className="text-richblack-300 text-lg">
      Continue creating new categories 🚀
    </p>
        ) : (
           <p className="text-richblack-300 text-lg">
      Continue your learning journey 🚀
    </p>
        )
      }


    {/* BUTTON */}
    
    {
      isInstructor ? (
        <button
      onClick={() => navigate("/dashboard/createCourse")}
      className="mt-4 px-6 py-3 bg-yellow-300 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md cursor-pointer"
    >
      Publish new course +
    </button>

      ) : isAdmin ? (
        <button
      onClick={() => navigate("/dashboard/createCategory")}
      className="mt-4 px-6 py-3 bg-yellow-300 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md cursor-pointer"
    >
      Create new category +
    </button>
      ) : (
          <button
      onClick={() => navigate("/dashboard/getAllEnrolledCourses")}
      className="mt-4 px-6 py-3 bg-yellow-300 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md cursor-pointer"
    >
      Go to My Courses
    </button>
      )
    }


    

  </div>
)}

        <Outlet />

      </div>
    </div>
  )
}

export default Dashboard