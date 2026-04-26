import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';

import HighlightText from "../../core/HomePage/HighlightText"
import CourseCard from './CourseCard';

const tabsName=[
    "Free Courses",
    "New to Coding",
    "Most Popular",
    "Skills Paths",
    "Career Paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses,setCourses]=useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading) //currentCard jo hai usko heading ke basis pe filter

    const setMyCards=(value)=>{
      setCurrentTab(value);
      const result=HomePageExplore.filter((info)=>info.tag === value );
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading)
    }

 
  return (
    <div className='w-11/12 flex items-center mx-auto flex-col gap-5 relative mb-45'>

      <div className='text-4xl font-bold text-white '>
        Unlock the <HighlightText text={"power of code"}/>
      </div>

      <p className='text-gray-400 text-xl'>
        Learn to build anything you can imagine
      </p>

      <div className='flex bg-richblack-700 rounded-full w-[50%]  items-center justify-evenly  mt-10 mb-10 '>
        {
          tabsName.map( (value,index) =>{
            return(
              <div className={`text-[16px] flex flex-row items-center gap-2 
                              ${currentTab===value ? "bg-richblack-900 text-richblack-5 font-medium "
                              :"text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer
                              hover:bg-richblack-900 hover: text-richblack-5 px-3 py-2 mt-2 mb-2
                              
                              `}
                              key={index}
                              onClick={()=>setMyCards(value)}
                              >
                              {value}
                
              </div>
            )
          })
        }

      </div>


      <div className='  w-full absolute mt-50'>

        <div className='flex gap-10  '>
          {
            courses.map ((element,index)=>{
              return (
                <CourseCard
                  key={index}
                  cardData={element}
                  currentCard={currentCard}
                  setCurrentCard={setCurrentCard}
                />
              )
            })
          }
        </div>

        

      </div>
      

    </div>
  )
}

export default ExploreMore