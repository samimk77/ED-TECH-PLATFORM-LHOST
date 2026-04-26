import React from 'react'
import instructorimg from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from "react-icons/fa";

const Instructor = () => {
  return (
    <div className='w-11/12  bg-richblack-900 max-w-maxContent flex flex-row items-center mx-auto gap-20 mt-30 text-white' >

        <div className='w-full'>
        <img src={instructorimg}/>

        </div>


        <div className='flex flex-col gap-15'>

        <h1 className='text-4xl font-bold '>Become an <HighlightText text={"Instructor"}/>  </h1>

        <p className='text-xl text-gray-400 '>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>

        <div className='w-fit'>
        <CTAButton 
        children={
            <div className='flex items-center gap-2'>
            Become an Instructor

            <FaArrowRight/>


            </div>
            
            
         } 
         active={true}
          linkto={"./signup"}
           />

        </div>

        

        </div>

    </div>
  )
}

export default Instructor