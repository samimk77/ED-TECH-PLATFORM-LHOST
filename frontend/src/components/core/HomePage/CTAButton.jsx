import React from 'react'
import { Link } from 'react-router-dom'


const CTAButton = ({children,active,linkto}) => {
  return (
    <Link to={linkto}>

    <div className={`text-center  px-6 py-3 rounded-md font-bold
     ${active ? "bg-yellow-300 text-black " :" bg-richblack-700 text-white" } transition-all  duration-300 hover:scale-95 `}>
        {children}
    </div>

    </Link>
  )
}

export default CTAButton