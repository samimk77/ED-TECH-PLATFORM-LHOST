import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import TimelineImage from "../../../assets/Images/TimelineImage.png"


const timeline=[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Inspiring others to achieve more than they thought possible."

    },
    {
        Logo:Logo2,
        heading:"Responsibility",
        Description:"Owning every decision and delivering on every promise made."

    },
    {
        Logo:Logo3,
        heading:"Flexibility",
        Description:"Adapting to change with confidence and a positive mindset."

    },
    {
        Logo:Logo4,
        heading:"Versatility",
        Description:"Bringing the right skills to every challenge, every time."

    },
]






const TimeLineSection = () => {
  return (
    <div>

        <div className='flex gap-15 items-center w-11/12 mx-auto mt-30'>

            <div className='flex flex-col w-[45%] gap-15'>

                {
                    timeline.map((element,index)=>{
                        return(

                            <div className='flex flex-row gap-5 ' key={index}>
                                <div className='w-[50px] h-[50px] bg-gray-200  rounded-full flex items-center justify-center'>
                                    <img src={element.Logo}/>
                                </div>

                                     {/* Dotted Line - last item pe nahi */}
                    { (
                        <div className='w-[1px] h-14 border-l-2 border-dashed border-richblack-200 mt-1'>
                        </div>
                    )}


                                <div className='flex flex-col'>
                                    <h1 className=' text-xl font-bold'>{element.heading}</h1>
                                    <p>{element.Description}</p>

                                </div>

                            </div>

                        )
                            
                            
                        
                    })
                }

                <div className='flex flex-row gap-5'>
                    <img></img>

                    <div className='flex flex-col'>
                        <h1></h1>
                        <p></p>

                    </div>

                </div>

            </div>




            {/* image wal section  */}

            <div className='relative'>
                <div>

                <img src={TimelineImage} className='relative z-10'/>

                <div className='absolute bg-green-900 w-[600px] h-[100px] top-119 left-14 z-10 text-xl '>

                    <div className=' text-white flex flex-row gap-40 h-full justify-evenly '>

                        <div className='flex gap-15 items-center justify-center '>
                           <h1 className='text-4xl'>10+</h1>

                            <div className='flex flex-col items-center justify-around text-[14px] text-green-300'>
                                <h1>YEARS OF</h1>
                                <h1>EXPERIENCE</h1>

                            </div>

                            <div className='w-[1px] h-[80%] bg-green-300 flex'>
                            </div>

                              <h1 className='text-4xl'>100+</h1>

                            <div className='flex flex-col items-center justify-around text-[14px] text-green-300'>
                                <h1>TYPES OF</h1>
                                <h1>COURSES</h1>

                            </div>

                        </div>

       

                    </div>

                </div>


                </div>

                <div className='w-[720px] h-[550px]  bg-green-800 opacity-50 blur-xl absolute bottom-1 right-4 '>

                </div>
            </div>

        </div>

    </div>
  ) 
}

export default TimeLineSection