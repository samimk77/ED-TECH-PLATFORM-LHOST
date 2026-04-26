import React, { useState } from 'react'

import { categories } from '../../services/apis';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import HighlightText from '../core/HomePage/HighlightText';
import { apiConnector } from '../../services/apiConnector';

const CreateCategory = () => {

    const {token} = useSelector((state)=>state.auth)

    const [categoryFormDetails,setCategoryFormDetails] =useState({
        name:"",
        description:"",
    });

    const {name,description}=categoryFormDetails;

    const handleChange=(e)=>{
      setCategoryFormDetails({...categoryFormDetails, [e.target.name]:e.target.value})
    }

    const handleSubmit =async(e)=>{
      e.preventDefault();

      if(!name || !description){
        return toast.error("All fields are mandatory");
        
      }
      const toastId = toast.loading("Creating category...");

      try {
      const res = await apiConnector (
        "POST",
        categories.CREATE_CATEGORY_API,
        {name,description},
        {
          Authorization:`Bearer ${token}`
        }
      )

      toast.success("Section created successfully")

        // reset form
      setCategoryFormDetails({
        name: "",
        description: "",
      });
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Section creation failed")
      
      
    }
    finally{
      toast.dismiss(toastId)
    }

    }

    

    

    

   return (
    <div className="w-full flex justify-center mt-10 px-4">

      <div className="w-full max-w-2xl bg-richblack-800 p-8 rounded-2xl shadow-lg border border-richblack-700">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create <HighlightText text={"Category"} />
          </h1>
          <p className="text-richblack-300 text-sm mt-2">
            Add a new category to organize your courses better
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-richblack-200">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Web Development"
              value={name}
              onChange={handleChange}
              className="bg-richblack-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-yellow-300 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-richblack-200">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Write a short description..."
              value={description}
              onChange={handleChange}
              rows={4}
              className="bg-richblack-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-yellow-300 transition resize-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-4 w-full bg-yellow-300 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md cursor-pointer"
          >
            Create Category +
          </button>

        </form>

      </div>
    </div>
  )
}

export default CreateCategory