import React, { useState ,useRef ,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../../../../slices/profileSlice'
import { setToken } from '../../../../slices/authSlice'
import { FaChevronDown } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import Cart from '../../../dashboard/Cart'
import { resetCart } from '../../../../slices/cartSlice'
import toast from 'react-hot-toast'

const ProfileDropDown = () => {

  const {totalItems}=useSelector((state)=>state.cart)

  const {user}=useSelector((state)=>state.profile)

  const isStudent=user?.accountType==="Student"

  const dispatch=useDispatch();
  const navigate =useNavigate();

  const [open,setOpen]=useState(false)

  const handleLogout= ()=>{
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token")
    localStorage.removeItem("user");
    toast.success("Logged out successfully")

    navigate("/login")
  }


{/*  KAHIN BAHAR CLICK KRNE SE DROPDOWN HATT JANA CHAIYE */}
  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div ref={dropdownRef} className='relative'>

    <div
        
     className='flex items-center gap-1 cursor-pointer relative'>

   {
  isStudent && (
    <>
      <div className='absolute w-4 h-4 bg-red-500 rounded-full text-white -top-0.5 left-4'>
        <div className='absolute -top-[2px] left-[4px] text-[15px]'>
          {totalItems}
        </div>
      </div>

      <IoIosCart
        onClick={() => navigate("/dashboard/cart")}
        className='text-richblack-200 w-9 h-7 mr-8 cursor-pointer'
      />
    </>
  )
}
 

    <img
    onClick={()=> setOpen(!open)}
    src={user?.image ||  `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName}`}
    className='w-11 h-11 rounded-full cursor-pointer border border-richblack-400 border-2 p-0.5'

    />

    <FaChevronDown onClick={()=> setOpen(!open)} className='text-richblack-200'/>

    </div>
    

    {
      open && (
        <div className='absolute right-0 mt-3 w-[180px] bg-richblack-800 text-white rounded-md shadow-lg z-50'>

            <div
            onClick={()=>navigate("/dashboard/profile")}
            className='px-4 py-2 hover:bg-richblack-700 cursor-pointer'
            >My Profile</div>

             <div
            onClick={()=>navigate("/dashboard")}
            className='px-4 py-2 hover:bg-richblack-700 cursor-pointer'
            >Dashboard</div>


             <div
            onClick={handleLogout}
            className='px-4 py-2 hover:bg-red-500 cursor-pointer'
            >Logout</div>

        </div>
      )
    }

    </div>
  )
}

export default ProfileDropDown