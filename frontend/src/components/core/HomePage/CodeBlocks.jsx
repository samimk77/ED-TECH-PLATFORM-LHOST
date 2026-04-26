import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundGradient,codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-18  text-white`}>

        {/* SECTION 1 */}
        <div className=' w-[50%] flex flex-col gap-8'>
        {heading}

        <div className='text-gray-500  text-left font-sm font-bold'>
            {subheading}
        </div>

        <div className='flex gap-8 mt-10'>

        <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
          <div className='flex gap-3 items-center'> {/* button ke text ke liye */}
             {ctabtn1.btntext}
             <FaArrowRight/>
          </div>
        </CTAButton>  
      

      <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >
        {ctabtn2.btntext}

      </CTAButton> 
      
       
        

        </div>


            
        </div>


        {/* SECTION 2 */}

        <div className='f-fit flex text-[18px] w-[100%] lg:w-[500px] relative '>

    <div className={`absolute w-[330px] h-[150px] rounded-full ${backgroundGradient} opacity-30 blur-3xl top-0 left-0`}>
</div>

        <div className='flex flex-col text-center w-[10%] text-richblack-400  '>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
         

        </div>

        <div className={`w[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 text-left`}>
            <TypeAnimation
                sequence={[codeblock,2000,""]}
                repeat={Infinity}
                cursor={true}
                style={
                    {
                        whiteSpace:"pre-line",
                        display:"block",
                    }
                }
                omitDeletionAnimation={true}

            />
        </div>







        </div>






    </div>
  )
}

export default CodeBlocks