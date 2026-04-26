import React, { useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";
import { categories } from "../../../services/apis";
import toast from "react-hot-toast";
import { FaFileContract } from "react-icons/fa";
import { useEffect } from "react";


const CourseInformation = ({ setStep, setCourseId }) => {
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    whatYouWillLearn: "",
    price: "",
    category: "",
    thumbnail: null,
  });

  const [catalogData,setCatalogData]=useState([])

  const fetchCatalog=async()=>{

    try {
      const res=await apiConnector(
        "GET",
        categories.CATEGORIES_API,
     
      )

      setCatalogData(res.data.data)
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
      
  }

  useEffect(() => {
    
  fetchCatalog();
    
  }, [])
  

  const [loading, setLoading] = useState(false);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔥 HANDLE FILE
  const [fileName, setFileName] = useState("");
const handleFileChange = (e) => {
  const file = e.target.files[0];

    if (file) {
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,   // ✅ IMPORTANT FIX
    }));
    setFileName(file.name);
};
}

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating course... ⏳");
  

    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      thumbnail,
    } = formData;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return toast.error("All fields are required");
    }
    

    try {
      setLoading(true);

      const data = new FormData();

      data.append("courseName", courseName);
      data.append("courseDescription", courseDescription);
      data.append("whatYouWillLearn", whatYouWillLearn);
      data.append("price", price);
      data.append("category", category);
      data.append("thumbnailImage", thumbnail); // 🔥 must match backend
      
      const res = await apiConnector(
        "POST",
        categories.CREATE_COURSE_API,
        data,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      console.log(res);

      // 🔥 IMPORTANT
      const newCourseId = res?.data?.data?._id;

      if (!newCourseId) {
        throw new Error("Course ID not received");
      }

      
      setCourseId(newCourseId);
      toast.success("Course created successfully");

      setStep(2); // move to builder

    } catch (error) {
      console.log(error);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
      toast.dismiss(toastId)

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-richblack-800 p-6 rounded flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold">Course Information</h2>

      {/* COURSE NAME */}
      <input
        name="courseName"
        placeholder="Course Name"
        value={formData.courseName}
        onChange={handleChange}
        className="bg-richblack-700 p-2 rounded"
      />

      {/* DESCRIPTION */}
      <textarea
        name="courseDescription"
        placeholder="Course Description"
        value={formData.courseDescription}
        onChange={handleChange}
        className="bg-richblack-700 p-2 rounded"
      />

      {/* WHAT YOU WILL LEARN */}
      <textarea
        name="whatYouWillLearn"
        placeholder="What you will learn"
        value={formData.whatYouWillLearn}
        onChange={handleChange}
        className="bg-richblack-700 p-2 rounded"
      />

      {/* PRICE */}
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="bg-richblack-700 p-2 rounded"
      />

      {/* CATEGORY */}
      
      <select
      name="category"
      value={formData.category}
      onChange={handleChange}
        className="bg-richblack-700 p-2 rounded text-white"
      
      >
       <option value="">Select Category</option>
       {
        catalogData.map((cat)=>(
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))
       }

      </select>

      {/* THUMBNAIL */}
    <div className="w-[50%]">

  {/* CUSTOM BUTTON */}
  <label className="bg-blue-400 text-black p-2 rounded-md cursor-pointer block text-center w-[25%]">
    
    {fileName ? fileName : "Upload File +"}  {/* ✅ placeholder + name */}

    <input
      type="file"
      onChange={handleFileChange}
      className="hidden"
    />
    
  </label>

</div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-300 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition cursor-pointer"
      >
        {loading ? "Creating..." : "Next"}
      </button>
    </form>
  );
};

export default CourseInformation;