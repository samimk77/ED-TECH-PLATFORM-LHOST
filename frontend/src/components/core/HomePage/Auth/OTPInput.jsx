import React, { useRef, useState } from 'react'


const OTPInput = ({setOtp})=>{
    const [otpArray,setOtpArray]=useState(["","","","","","",])
    const inputRefs=useRef([])

    const handleChange=(value,index)=>{
          if (!/^[0-9]?$/.test(value)) return; // only digits

          const newOtp=[...otpArray]; //har index ke liye ye perform hoga
          newOtp[index]=value;
          setOtpArray(newOtp)


          //move to next box

          if(index<5 && value){
            inputRefs.current[index+1].focus();
          }
          setOtp(newOtp.join(""));
    }

    const handleKeyDown = (e,index)=>{
        
        //backspace go to previous

        if(e.key==="Backspace" && !otpArray[index] && index>0){
            inputRefs.current[index-1].focus()
        }
    }

return (
    <div className="flex gap-3 justify-center">
      {otpArray.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl rounded-md bg-richblack-800 text-white outline-none"
        />
      ))}
    </div>
     
  )
}


export default OTPInput
