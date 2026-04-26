import React from "react";
import { CgProfile } from "react-icons/cg";
import { FaBook } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import toast from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice";
import { IoCreateSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user}=useSelector((state)=>state.profile)

  const isInstructor=user?.accountType==="Instructor"
  const isAdmin=user?.accountType==="Admin"
  const isStudent=user?.accountType==="Student"

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

  const activeStyle =
    "bg-yellow-300 text-black  shadow-md";

    return (
  <div className="flex flex-col justify-between w-[240px] h-screen bg-richblack-900 text-richblack-25 border-r border-richblack-700 p-4">

    {/* TOP SECTION */}
    <div className="flex flex-col gap-3">

      <h2 className="text-xl font-sans font-bold mb-6 text-center text-yellow-300">
        Dashboard
      </h2>

      {/* Profile - for all */}
      <NavLink
        to="/dashboard/profile"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
        }
      >
        <CgProfile size={20} />
        <span>My Profile</span>
      </NavLink>

      {/* Courses (NOT for Admin) */}
      {!isAdmin && (
        <NavLink
          to="/dashboard/getAllEnrolledCourses"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
          }
        >
          <FaBook size={18} />
          {isInstructor ? (
            <span>My Courses</span>
          ) : (
            <span>Enrolled Courses</span>
          )}
        </NavLink>
      )}

      {/* Instructor Only */}
      {isInstructor && (
        <NavLink
          to="/dashboard/createCourse"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
          }
        >
          <IoCreateSharp size={18} />
          <span>Create New Course</span>
        </NavLink>
      )}

      {/* Admin Only */}
      {isAdmin && (
        <>
          <NavLink
            to="/dashboard/createCategory"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
            }
          >
            <IoCreateSharp size={18} />
            <span>Add New Category</span>
          </NavLink>

          <NavLink
            to="/dashboard/manageStudents"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
            }
          >
            <MdManageAccounts size={18} />
            <span>Manage Students</span>
          </NavLink>

          <NavLink
            to="/dashboard/manageInstructors"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-richblack-800"}`
            }
          >
            <MdOutlineManageAccounts size={18} />
            <span>Manage Instructor</span>
          </NavLink>
        </>
      )}

      <hr className="my-4 border-richblack-700" />

      {/* Settings */}
      <button
        onClick={() => {
          console.log("settings clicked");
          navigate("/dashboard/profile", { state: { openEdit: true } });
        }}
        className={`${linkStyle} hover:bg-richblack-800 w-full cursor-pointer`}
      >
        <IoIosSettings size={20} />
        <span>Settings</span>
      </button>
    </div>

    {/* BOTTOM SECTION */}
    <div className="mb-15 w-fit">
      <button
        onClick={handleLogout}
        className="flex bg-richblack-600 items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-richblack-700 cursor-pointer transition-all duration-200"
      >
        <div className="flex items-center justify-between gap-2 px-3 mr-1">
          <MdLogout size={20} />
          <span className="font-bold text-richblack-50">Log Out</span>
        </div>
      </button>
    </div>
  </div>
);

};

export default Sidebar;