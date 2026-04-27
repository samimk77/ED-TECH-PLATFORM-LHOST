import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/CTAButton';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import homepagebg from "../assets/Images/bghome.svg"
import TimeLineSection from '../components/core/HomePage/TimeLineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import Instructor from '../components/core/HomePage/Instructor';
import Review from '../components/core/HomePage/Review';
import Footer from '../components/common/footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';


const Home = () => {
      const { token } = useSelector((state) => state.auth);
  return (
    <div>
        {/*SECTION 1 DARK BLUE BG  */}

        <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between'>
            <Link to={"/signup"}>

            <div className=' group max-auto bg-richblack-800 rounded-full p-2 font-bold text-richblack-50
             transition-all duration-300 hover:scale-95 w-fit mt-16 '>

                <div className='flex items-center gap-2 group-hover:bg-richblack-900  rounded-full
                transition-all duration-300 px-[20px] py-[5px]'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                    
                </div>
            </div>

            </Link>

            <div className='text-2xl sm:text-3xl lg:text-4xl mt-8 font-semibold text-center' >
                Empower Your Future with <HighlightText text={"Coding Skills"}/>
            </div>


            <div className=' text-sm text-center w-11/12 mt-5 text-gray-400 relative'>
                This website is designed to help users enhance their skills through interactive learning. It offers structured courses, practical exercises, and real-world projects. The platform focuses on simplicity and accessibility.
         
            <div className='flex gap-5 mt-8 items-center justify-center' > 
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                <CTAButton>Book a Demo</CTAButton>
            </div>

            <div className=' mt-18 w-full sm:w-[90%] lg:w-[80%] mx-auto relative'>

            <div className="absolute w-[1050px] h-[580px]  bg-gradient-to-r from-blue-400 to-purple-600 opacity-30 blur-xl -top-3 right-1 z-0">
</div>


                <video className='relative z-10'
                muted
                loop
                autoPlay
                >
                <source src={Banner}/>

                </video>
            </div>


            {/* Code wala section 1 */}

          <div >
            <CodeBlocks
                position={"lg:flex-row flex-col"}
                 heading={
                    <div className=' text-2xl lg:text-4xl font-semibold text-center lg:text-left   '>
                    Unlock your <HighlightText text={"Technical "} />
                    Skills with our courses

                    </div>
                    
                    }

                    subheading={
                        <div className='w-[90%] text-[18px]'>
                         This website is designed to help users enhance their skills through interactive learning. It offers structured courses, practical exercises, and real-world projects.
                        
                        </div>
                    }
                       
                    
                    ctabtn1={
                        {
                            btntext:"Try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }

                       ctabtn2={
                        {
                            btntext:"Learn more",
                            linkto:"/about",
                            active:false
                        }
                    }

                    codeblock={`<!doctype html> rel="icon"\nimport { Link } from 'react-router-dom';\n<head><></>\n<meta charset/>\n<link rel="icon" />\n<meta name="viewport"\n content="width=device\n<title>frontend</title>\n <div id="root">\n  <script type="module"></script> />`}
                    codeColor={"text-yellow-25"}  
                    backgroundGradient={"bg-yellow-300"}          

            />
          </div>

           <div className='mt-45'>
            <CodeBlocks
                position={"flex-col-reverse lg:flex-row-reverse"}
                 heading={
                    <div className='text-4xl font-semibold text-left  '>
                    Master the art of  <HighlightText text={"Code "} />
                   that actually works

                    </div>
                    
                    }

                    subheading={
                        <div className='w-[90%] text-[18px]'>
                        Learn from industry experts who have built real products at top tech companies. Get hands-on experience with projects that matter and skills that employers are actively looking for
                        </div>
                    }
                       
                    
                    ctabtn1={
                        {
                            btntext:"Continue lesson",
                            linkto: token? "/dashboard/getAllEnrolledCourses" :"/signup",
                            active:true
                        }
                    }

                       ctabtn2={
                        {
                            btntext:"Learn more",
                            linkto:"/about",
                            active:false
                        }
                    }

                    codeblock={`import React from "react";\nimport './index.css'\nimport App from './App.jsx'\n import Route from 'react-router-dom'\nfunction App() { \n  return (  \n<div>\n<Route path='/' element={<Home/>}/>\n</div> `}
                    codeColor={"text-blue-400"}  
                      backgroundGradient={"bg-blue-400"}           

            />
          </div>
              
                
               
            </div>
           
             <ExploreMore/>

             
        </div>


       





        {/*SECTION 2 WHITE BG  */}

        <div className=' bg-pure-greys-5 text-richblack-700'>
         <div className='homepage_bg h-[310px]'>
    

                    <div className='w-11/12 max-w-maxContent flex items-center gap-5 justify-center mx-auto '>
                              
                        <div className='flex gap-7 items-center mt-55'>
                          <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-2 justi'>
                                    Explore Full Catalog
                                    <FaArrowRight/> 
                                </div>
                          </CTAButton>

                            <CTAButton active={false} linkto={"/"}>
                                <div className='flex items-center gap-2'>
                                    Learn more
                                    <FaArrowRight/> 
                                </div>
                          </CTAButton>

                        </div>


                   

                    </div>

         </div>

         <div className='w-11/12 max-w-maxContent flex flex-col mx-auto'>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 text-left mt-20'>
                    <div className='w-full  text-4xl   font-bold'>
                    Get the skills you need for a
                    <HighlightText text={" job that's in demand"}/>
                    
                    </div>

                    <div>
                    <div className='w-full flex flex-col'>
                        <div>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>

                        
                           
                    </div>
                    <div className='w-fit mt-10'>
                     <CTAButton children={"Learn more"} active={true} linkto={"/about"}/>

                    </div>
                    

                    </div>
                    
                    
         

            </div>

         </div>




         {/*  Timeline SECTION */}
          
          

         <TimeLineSection/>

        <LearningLanguageSection/>
        

        

        </div>
        {/*SECTION 3 DARK BLUE BG  */}

        <Instructor/>

         {/* Review Section  */}
                    
         <Review/>           






        {/*SECTION 4 FOOTER  */}
        <Footer/>

    </div>
  )
}

export default Home