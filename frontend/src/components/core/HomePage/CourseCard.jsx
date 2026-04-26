import React from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div
      className={`p-5 rounded-lg cursor-pointer  w-[340px] h-[300px] items-center mx-auto mt-20
      ${currentCard === cardData.heading ? "bg-gray-100 text-black" : "bg-richblack-800 text-white"}`}
      onClick={() => setCurrentCard(cardData.heading)}
    >
      <h1 className='text-xl font-bold relative '>{cardData.heading}</h1>

      <p className='text-[16px] text-richblack-300  mt-8'>{cardData.description}</p>

      <div className='flex absolute justify-between mt-28 text-sm text-yellow-500 font-bold'>

      <div className='flex gap-35'>
        <span>{cardData.level}</span>
        <span>{cardData.lessionNumber} Lessons</span>
        
      </div>
      
        
      </div>
    </div>
  );
};
export default CourseCard