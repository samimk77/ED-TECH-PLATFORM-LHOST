import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import HighlightText from "../core/HomePage/HighlightText";
import { useRef } from "react";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/profileSlice";
import toast from "react-hot-toast";
import { profileSlice } from "../../slices/profileSlice";
import { authSlice } from "../../slices/authSlice";
import CTAButton from "../core/HomePage/CTAButton";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const MyProfile = () => {

  const location=useLocation(); //settings me click krne ke baad edit wala modal open hojae uske liye use krrhe

  console.log("location.state:", location.state);

  const { user } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const finalToken =
  token || JSON.parse(localStorage.getItem("token"));



  if (!user) return <div className="text-white">Loading...</div>;

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("displayPicture", file);
  const toastId = toast.loading("Updating Profile Picture...");


  try {
    const res = await apiConnector(
      "PUT",
      categories.UPDATE_DISPLAY_PICTURE_API,
      formData,
      {
       "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${finalToken}`,
      }
    );

    //  update redux
    dispatch(setUser(res.data.user));
    //UPDATE LOCALSTOREAGE
    localStorage.setItem("user",JSON.stringify(res.data.user))

    toast.success("Profile Pic Updated")

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message ||  "Something went wrong")
  }
  finally{
    toast.dismiss(toastId);
  }
};


{/* EDIT PROFILE*/}

const [isEditing,setIsEditing]=useState(
  location.state?.openEdit || false
);


useEffect(() => {
  if (location.state?.openEdit) {
    setIsEditing(true);
  }
}, [location.state]);

 const [formData,setFormData]=useState({
        contactNumber:user?.additionalDetails?.contactNumber || "",
        gender:user?.additionalDetails?.gender || "",
        dateOfBirth:user?.additionalDetails?.dateOfBirth || "",
        about:user?.additionalDetails?.about || "",
        firstName:user?.firstName || "",
        lastName:user?.lastName || "",

    })

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }

    const handleSave =async ()=>{
        try {
            const res= await apiConnector(
                "PUT",
                categories.UPDATE_PROFILE_API,
                formData,

                {
                    Authorization : `Bearer ${token}`,
                }
            );

   
            dispatch(setUser(res.data.user));

            if(res.data.user){
            localStorage.setItem("user",JSON.stringify(res.data.user))

            }

             setFormData({
      contactNumber: res.data.user.additionalDetails.contactNumber || "",
      gender: res.data.user.additionalDetails.gender || "",
      dateOfBirth: res.data.user.additionalDetails.dateOfBirth || "",
      about: res.data.user.additionalDetails.about || "",
      firstName: res.data.user.firstName || "",
      lastName: res.data.user.lastName || "",
    });

            

            toast.success("Profile Updated Successfully")

            setIsEditing(false);
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile")
            
        }
    }









    //CHANGE PASSWORD LOGIC

    const [passwordData,setPasswordData]=useState({
      oldPassword:"",
      newPassword:"",
      confirmNewPassword:"",
    })

    const handlePasswordChange=(e)=>{
      setPasswordData({
        ...passwordData,
        [e.target.name] : e.target.value}
      );
    }


    const handlePasswordSave=async()=>{
      try {

        const res = await apiConnector(
          "POST",
          categories.CHANGE_PASSWORD_API,
          passwordData,
          {
            Authorization:`Bearer ${token}`,
          }
        )
        toast.success("Password Updated Successfully")


        
      } catch (error) {
        toast.error(
      error.response?.data?.message || "Failed to change password")
        
      }
    }


//DELETE ACCOUNT

const [deleteModal,setDeleteModal]=useState(false);
const navigate=useNavigate();



const handleDelete =async()=>{


    if(!user){
      toast.error("user not found");
    }

  try{
    const res= await apiConnector(
      "DELETE",
      categories.DELETE_PROFILE_API(user.id),
      null,
      {
        Authorization:`Bearer ${token}`
      },

    )
      dispatch(setUser(null))


    toast.success("User deleted successfully");
    navigate("/login")
  }
    catch(error){
        toast.error(error.response?.data.message)
    }


  }







  return (
    
    <div className="text-white w-11/12 flex flex-col mx-auto mt-8">

    {/* IF NOT EDITING THEN SHOW DETAILS */}

    {!isEditing ? (
      <>
      <div  className="text-3xl font-semibold mb-8">
      <HighlightText text={"My Profile"}/>

      </div>
     

      {/* 🔹 TOP CARD */}
      <div className="flex justify-between items-center bg-richblack-800 p-6 rounded-md mb-6">

      <input
  type="file"
  ref={fileInputRef}
  className="hidden"
  accept="image/*"
  onChange={handleImageChange}
/>

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* PROFILE IMAGE */}
          <img
            src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName}`}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover"
          />

          {/* NAME + EMAIL */}
          <div>
            <p className="text-lg font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-richblack-300">
              {user.email}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button
        onClick={() => fileInputRef.current.click()}
         className="flex items-center gap-2 bg-yellow-300 text-black px-4 py-2 rounded-md hover:bg-yellow-500 cursor-pointer">
          <FaEdit />
          Edit
        </button>

      </div>

      {/* 🔹 PERSONAL DETAILS */}
      <div className="bg-richblack-800 p-6 rounded-md">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-semibold">Personal Details</p>

          <button 
          onClick={()=>setIsEditing(true)}
          
          className="flex items-center gap-2 bg-yellow-300 text-black px-4 py-2 rounded-md hover:bg-yellow-500 cursor-pointer">
            <FaEdit />
            Edit
          </button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-6">

          {/* FIRST NAME */}
          <div>
            <p className="text-sm text-richblack-300">First Name</p>
            <p className="font-medium">{user.firstName}</p>
          </div>

          {/* LAST NAME */}
          <div>
            <p className="text-sm text-richblack-300">Last Name</p>
            <p className="font-medium">{user.lastName}</p>
          </div>

          {/* EMAIL */}
          <div>
            <p className="text-sm text-richblack-300">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {/* PHONE */}
          <div>
            <p className="text-sm text-richblack-300">Phone Number</p>
            <p className="font-medium">
              {user.additionalDetails?.contactNumber || "Not added"}
            </p>
          </div>

        </div>

      </div>
    </>
    
    ) : (   


      
        deleteModal? (
          <div className="flex flex-col gap-5 mt-40 justify-center mx-auto w-[30%] h-[250px] bg-richblack-800 rounded-md">
            
           <h1 className="text-center text-xl font-sans font-bold">CONFIRM ACCOUNT DELETION ?</h1>
           <p className="text-center text-sm mb-8">We are sad to see you go :( </p>
           <div className="flex flex-row justify-evenly ">
            
           <button
           onClick={()=>setDeleteModal(false)}
           className="bg-richblack-600 px-5 py-2 rounded-md cursor-pointer text-[18px]  font-sans w-30 hover:bg-richblack-700"
           >Cancel</button>


           <button
           onClick={handleDelete}
           className="bg-red-700 px-5 py-3 rounded-md cursor-pointer text-[18px] font-sans w-30 hover:bg-red-800"
           >Confirm</button>


           

           </div>

          </div>
        ) : (


            //EDIT PROFILE WALA MODAL
      
      <div className="text-white ">

  {/* TITLE */}
  <div className="text-3xl font-semibold mb-8">
  <HighlightText text={"Edit Profile"}/>
 

  </div>

  {/* 🔹 PROFILE SECTION */}
  <div className="bg-richblack-800 p-6 rounded-md mb-6">

    <p className="text-xl mb-4 font-semibold  ">Profile Information</p>

    <div className="grid grid-cols-2 gap-10">

      {/* FIRST NAME */}
       <div className="flex flex-col gap-1 ">
      <h1 className="text-sm font-sans ">First Name :</h1>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        className="p-3 bg-richblack-700 rounded outline-none w-full"
      />
    </div>

     <div className="flex flex-col gap-1 ">
      <h1 className="text-sm font-sans ">Last Name :</h1>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        className="p-3 bg-richblack-700 rounded outline-none w-full"
      />
    </div>
     

      {/* DATE OF BIRTH */}
    <div className="flex flex-col gap-1 ">
      <h1 className="text-sm font-sans ">Date Of Birth :</h1>
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        className="p-3 bg-richblack-700 rounded outline-none w-full"
      />
    </div>
      

      {/* GENDER */}

      <div>
        <h1 className="text-sm font-sans mb-2">Gender :</h1>
        <hr className="text-richblack-500"></hr>

         <div className="flex items-center gap-6 mt-4">
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleChange}
          /> Male
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleChange}
          /> Female
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="Other"
            checked={formData.gender === "Other"}
            onChange={handleChange}
          /> Other
        </label>
      </div>

      </div>
     
      
      <div>
        <h1 className="text-sm font">Phone Number :</h1>
         <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="p-3 bg-richblack-700 rounded outline-none w-full"
      />

      </div>
   
     
      <div>
        <h1 className="text-sm font">About :</h1>
        
        <input
        type="text"
        name="about"
        value={formData.about}
        onChange={handleChange}
        placeholder="About"
        className="p-3 bg-richblack-700 rounded outline-none w-full"
      />
      </div>
      
      

    </div>
  </div>

  {/* 🔹 PASSWORD SECTION */}
  <div className="bg-richblack-800 p-6 rounded-md mb-6">

    <p className="text-xl mb-4 font-semibold">Reset Password</p>

    <div className="grid grid-row-3 gap-6 w-[60%]">

      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-sans">Old Password :</h1>
         <input
         onChange={handlePasswordChange}

        name="oldPassword"
        type="password"
        placeholder="Enter Old Password"
        className="p-3 bg-richblack-700 rounded outline-none"
      />
      </div>
     
   <div className="flex flex-col gap-1">
        <h1  className="text-sm font-sans">New Password :</h1>
         <input
         onChange={handlePasswordChange}

        name="newPassword"
        type="password"
        placeholder="Enter New Password"
        className="p-3 bg-richblack-700 rounded outline-none"
      />
      </div>


         <div className="flex flex-col gap-1">
        <h1  className="text-sm font-sans">Confirm New Password :</h1>
         <input
         onChange={handlePasswordChange}
        name="confirmNewPassword"
        type="password"
        placeholder="Confirm New Password"
        className="p-3 bg-richblack-700 rounded outline-none"
      />
      </div>
      

    </div>

    <button
      onClick={handlePasswordSave}
    
      className="bg-yellow-300 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400 cursor-pointer mt-8"
    >
      Change Password
    </button>

  </div>

  {/* 🔹 DELETE ACCOUNT */}
  <div
  onClick={()=>setDeleteModal(true)}
   className="bg-red-800 p-6 rounded-md mb-6 cursor-pointer hover:bg-red-900">
    <p className="font-semibold text-lg">Delete Account</p>
    <p className="text-sm text-red-200 mt-2">
      This account contains Paid Courses. Deleting your account will remove all the content associated with it.
    </p>
  </div>

  {/* 🔹 BUTTONS */}
  <div className="flex justify-end gap-4">
    <button
      className="bg-richblack-600 px-4 py-2 rounded hover:bg-richblack-700 cursor-pointer"
      onClick={() => setIsEditing(false)}
    >
      Cancel
    </button>

    <button
      onClick={handleSave}
    
      className="bg-yellow-300 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400 cursor-pointer"
    >
      Save
    </button>
  </div>

</div>



        )
      


    

      
      )}

      
      

    </div>
  );
}


export default MyProfile;