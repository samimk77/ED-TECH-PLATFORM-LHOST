import React from 'react'
import { Await, Link, NavLink } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useState , useEffect} from 'react'
import { useSelector } from 'react-redux'
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropDown from "../core/HomePage/Auth/ProfileDropDown"
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {

    const {token} = useSelector( (state)=>state.auth )
    const {user} =useSelector((state)=>state.profile)
    const {totalItems}=useSelector((state)=>state.cart)
    
    const [subLinks,setSubLinks]=useState([])

    const isInstructor=user?.accountType==='Instructor'
    const isAdmin=user?.accountType==="Admin"
    const isStudent=user?.accountType==="Student"



    const fetchSublinks =async()=>{
        
            try {
                const result = await apiConnector("GET",categories.CATEGORIES_API)
                console.log("Printing sublinks result : ",result);
                
                setSubLinks(result.data.data)
            } catch (error) {
                console.log(error);
                
                
            }
        
    }

    useEffect(() => {
      
       fetchSublinks();
      
    }, [])
    




const [currNav, setCurrNav] = useState("")

  return (
    <div className='flex h-14 items-center border-b-[1px] border-b-richblack-700  '>

        <div className='w-11/12 flex max-w-maxContent items-center justify-between mx-auto '>
            <Link to={"/"}>
                <img src={logo} className='w-40'/>
            </Link>


        <nav>
            <ul className='flex gap-10 text-richblack-25'>
                {
                   NavbarLinks.map((element,index)=>{
                    return(
                        <li key={index} >
                        {
                            element.title==="Catalog"? 
                            (<div className='relative flex items-center gap-1 text-white cursor-pointer group'>
                                <p>{element.title}</p>
                                <MdKeyboardArrowDown />

                                <div className='invisible absolute felx flex-col rounded-md bg-richblack-25 p-4 text-richblack-900
                                opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[200px] top-8 translate-x-[-10%] z-10  '>

                                <div className='absolute h-2 w-6 rotate-38 bg-richblack-25  top-0 translate-x-[275%]'>

                                </div>

<div className="max-h-[200px] overflow-y-auto flex flex-col gap-1">

  {subLinks.length > 0 ? (
    subLinks.map((subLink, index) => (
      <Link
        key={index}
        to={`/catalog/${subLink._id}`}
        className="block rounded-md py-2 px-3 hover:bg-richblack-50"
      >
        {subLink.name}
      </Link>
    ))
  ) : (
    <p className="text-sm text-richblack-500">Loading...</p>
  )}

</div>
                                </div>


                            </div>)
                             : 
                             (<Link to={element.path}
                              onClick={()=>setCurrNav(element.title)}
                              className={`${currNav===element.title ? "text-yellow-300" :" text-white"} `}>{element.title}</Link>)
                        }
                        </li>
                        
                    )
                   }) 
                }
            </ul>
        </nav>


        {/* LOGIN / SIGNUP  */}
        
        <div className='flex gap-5 items-center'>

                 {
                    isStudent && (
                        <Link to="/dashboard/cart" className='relative'>
                            <FaCartShopping />

                            {
                                totalItems > 0 && (
                                    <span>{totalItems}</span>
                                )
                            }

                        </Link>
                    ) 
                 }




                 {
                    token ==null && (
                        <Link to="/login">
                            <button className=' w-[80px] px-2 py-1.5  rounded-md border-richblack-600 border-2 text-gray-200 cursor-pointer hover:bg-richblack-800 '>
                                Log in
                            </button>

                        </Link>
                    )
                 }




                    {

                    token ==null && (
                        <Link to="/signup">
                            <button className=' w-[80px] px-2 py-1.5 border-richblack-600 border-2 text-white rounded-md  cursor-pointer hover:bg-richblack-800 '>
                                Sign up
                            </button>

                        </Link>
                    )
                 }

                 {
                    token !==null && <ProfileDropDown/>
                 }



        </div>





        </div>

    </div>
  )
}

export default Navbar