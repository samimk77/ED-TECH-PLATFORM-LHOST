import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import toast from 'react-hot-toast'
import { useEffect } from 'react';
import HighlightText from '../components/core/HomePage/HighlightText';
import { useNavigate } from 'react-router-dom';
import CTAButton from "../components/core/HomePage/CTAButton"
import Spinner from '../components/common/Spinner';

const EnrolledCourses = () => {
    const {user}= useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth)
    const navigate= useNavigate();

    const [courses,setCourses]=useState([]);

    const isInstructor=user?.accountType==="Instructor"
  const [loading,setLoading]=useState(false)
    
    const fetchCourses=async()=>{
      try {
        setLoading(true)
        const res=await apiConnector(
          "GET",
          categories.ENROLLED_COURSES_API,
          null,
          {
            Authorization:`Bearer ${token}`
          }
        )

        setCourses(res.data.courses || []);
        
      } catch (error) {
        console.log(error)
      toast.error("Failed to fetch courses")
      }
      setLoading(false);
    }

    useEffect(()=>{
      fetchCourses();
    },[])

     if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size={40} />
      </div>
    )
  }

 return (
  <div className="w-11/12 mx-auto grid grid-cols-3 gap-8 text-white">
    
                
    {
      
      courses.length === 0 ? (
        <p>No enrolled courses yet..</p>
      ) : (
        <>
          <div className="col-span-3 text-3xl mt-9 font-bold ">
          {
            isInstructor ? (<HighlightText text={"Published Courses"}/>) :(<HighlightText text={"Enrolled Courses"}/>)
          }
          </div>

          {courses.map((course) => (
            <div
            onClick={()=>navigate(`/course/${course._id}`)}
              key={course._id}
              className="bg-richblack-800 rounded-lg overflow-hidden shadow-md hover:scale-101 transition flex flex-col cursor-pointer"
            >

              <img
                src={course.thumbnail}
                className="w-full h-60 object-cover"
              />

              <div className="p-4 flex flex-col gap-2">

                <h2 className="font-semibold text-lg">
                  {course.courseName}
                </h2>

                <p className="text-sm text-richblack-300">
                  {course.courseDescription}
                </p>


              </div>

            

            </div>
            
          ))}
        </>
      )
    }

  </div>
);
}

export default EnrolledCourses