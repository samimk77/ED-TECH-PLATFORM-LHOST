import React from 'react'
import { useState } from 'react'
import { apiConnector } from '../services/apiConnector'
import { categories } from '../services/apis'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const ManageStudents = () => {
    const {token} = useSelector((state)=>state.auth)
    const[loading,setLoading]=useState(false);

    const [student,setStudent]=useState([])

    const fetchStudents=async()=>{
        try {
            setLoading(true);
            const res=await apiConnector(
            "GET",
            categories.GET_ALL_STUDENTS_API,
            null,
            {
                Authorization :`Bearer ${token}`
            }
        )
            setStudent(res.data.students)
            
        } catch (error) {

            console.log(error);

            
            
        }
        setLoading(false);
        
    }

    useEffect(() => {
      fetchStudents()
    }, [])



    const handleDeleteUser=async(userId)=>{
        try {

            await apiConnector(
                "DELETE",
                categories.DELETE_PROFILE_API(userId),
                null,
                {
                Authorization:`Bearer ${token}`
                }
            )
            toast.success("Student removed successfully")
            fetchStudents();
            
        } catch (error) {
            console.log(error);
            
            
        }
       
    }

      if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size={40} />
      </div>
    )
  }
    
  return (
    <div className='w-11/12 grid grid-cols-4 gap-6 mx-auto text-white'>

      {
        !loading &&student.length === 0 ? (
          <p>No students found</p>
        ) : (
          student.map((student) => (
            <div
              key={student._id}
              className='bg-richblack-800 p-4 rounded-lg flex flex-col items-center gap-2 relative'
            >
             <MdDelete
             onClick={()=>handleDeleteUser(student._id)}
              className='absolute ml-55 text-xl text-red-700 cursor-pointer '/>

          
                <img
                src={student.image}
                className='w-16 h-16 rounded-full object-cover'
              />

             

        
            

              <h1 className='text-sm font-semibold text-center mt-4'>
                {student.firstName} {student.lastName}
              </h1>

            </div>
          ))
        )
      }

    </div>
  )
}

export default ManageStudents