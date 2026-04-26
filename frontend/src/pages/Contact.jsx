import React, { useState } from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton'
import toast from 'react-hot-toast'
import { apiConnector } from '../services/apiConnector'
import { categories } from '../services/apis'
import Footer from '../components/common/footer'


const Contact = () => {

    const [formDetails,setFormDetails]=useState({
        firstName:"",
        lastName:"",
        contactNumber:"",
        email:"",
        message:"",
    })

    const {firstName,lastName,contactNumber,email,message}=formDetails;

    const handleChange = (e)=>{
        setFormDetails({...formDetails,[e.target.name]:e.target.value})
    }

    const handleSubmit =async(e)=>{
        e.preventDefault();
        if(!firstName || !lastName || !contactNumber || !message){
            toast.error("All fields are required")
            return;
        }

        const toastId= toast.loading("Sending mail")

        try {
            const res = await apiConnector(
                "POST",
                categories.CONTACT_API,
                {firstName,lastName,contactNumber,email,message}
            )
            toast.success("Mail sent")

            setFormDetails({
                firstName:"",
                lastName:"",
                contactNumber:"",
                message:"",
                email:"",

            })
            
        } catch (error) {
            console.log(error);
            toast.error("Failed to send mail")
            
            
        }
        finally{
            toast.dismiss(toastId)
        }

    }




  return (
    <div>
         <div className='w-11/12 flex flex-col gap-2 mx-auto items-center mb-15'>

    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-2xl mt-10'>

            <div className='text-3xl mb-5 '>
          <HighlightText text={"Got something to share? Drop your message below !!"}/>

            </div>

        {/* First & Last Name */}
        <div className='flex gap-4'>
          <div className='flex flex-col gap-1 w-full'>
            <label className='text-sm text-gray-300'>First Name</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className='bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-white/30'
            />
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label className='text-sm text-gray-300'>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className='bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-white/30'
            />
          </div>
        </div>

        {/* Email */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-300'>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter email address"
            className='bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-white/30'
          />
        </div>

        {/* Phone */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-300'>Phone Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={contactNumber}
            onChange={handleChange}
            placeholder="97XXXXXXXX"
            className='bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-white/30'
          />
        </div>

        {/* Message */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-300'>Message</label>
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here"
            rows={5}
            className='bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-white/10 focus:border-white/30 resize-none'
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className='bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors cursor-pointer'
        >
          Send Message
        </button>

    </form>


    </div>
    <Footer/>
    </div>
   
    
  )
}

export default Contact