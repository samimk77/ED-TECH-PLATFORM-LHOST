import React from 'react'
import HighlightText from './HighlightText'
import image1 from "../../../assets/Images/Compare_with_others.svg"
import image2 from "../../../assets/Images/Know_your_progress.svg"
import image3 from "../../../assets/Images/datecalen.png"
import CTAButton from "../../../components/core/HomePage/CTAButton"




const LearningLanguageSection = () => {
  return (
    <div className='w-11/12 max-w-maxContent mt-60  mx-auto'>

        <div className='flex flex-col gap-8 items-center'>

            <div className='text-4xl font-bold'>
                Your Ultimate Toolkit for <HighlightText text={"Mastering Any Skill"}/>
            </div>

            <p className='text-[16px] text-center w-[75%] font-[600] text-gray-600'>Take control of how you learn. With 50+ expert-led courses, 
            real-world projects, AI-powered feedback, progress tracking, 
            and a personalized learning path built just for you.</p>

            <div className='flex items-center justify-center '>
            <img src={image2} className=' object-contain -mr-32'/> 
            <img src={image1} className=' object-contain -mr-42'/>
            <img src={image3} className='object-contain  '/>
           
                
              
               


            </div>

            <div className='mb-10'>
                <CTAButton children={"Learn more"} active={true} linkto={"/signup"}/>
            </div>

         
            
        </div>
        

    </div>
  )
}

export default LearningLanguageSection