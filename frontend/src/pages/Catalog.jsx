import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import HighlightText from "../components/core/HomePage/HighlightText";
import { Link } from "react-router-dom";
import Spinner from "../components/common/Spinner";



const Catalog = () => {
  const { catalogId } = useParams();

  const [data, setData] = useState(null);
  const [loading,setLoading]=useState(false);

  const fetchCatalog = async () => {
    try {
      setData(null);
      setLoading(true);
      const res = await apiConnector(
        "GET",
        categories.CATEGORY_PAGE_DETAILS_API(catalogId)
      );

      setData(res.data);

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, [catalogId]);

   


   if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size={40} />
      </div>
    )
  }

  if (!data) return <div className="text-white text-xl flex items-center justify-center mt-[20%]">No courses for this category yet :( </div>;


  const { selectedCategory ,selectedCourses, differentCourses, mostSellingCourses } = data;

  return (
    <div className="text-white p-10 ">

      {/* 🔹 CATEGORY TITLE */}

        <div className="text-3xl font-bold mb-4">
        <HighlightText text={`Catalog / ${selectedCategory?.name}`} />

        </div>
      

      {/* 🔹 COURSES */}
      <h2 className="text-xl text-richblack-25 mb-4">Courses to get you started</h2>

      <div className="grid grid-cols-3 gap-6 ">
        {selectedCourses.map((course) => (
          <Link to={`/course/${course._id}`} key={course._id} className="bg-richblack-800 p-4 rounded  cursor-pointer hover:scale-101 transition-all duration-300">

            <img src={course.thumbnail} className="rounded w-[100%] h-[300px]"/>

            <h3 className="mt-2 font-semibold">
              {course.courseName}
            </h3>

            <p className="text-yellow-300">₹ {course.price}</p>

          </Link>
        ))}
      </div>

      {/* 🔹 TOP COURSES */}
      <h2 className="text-3xl mt-10 mb-4">
        <HighlightText text={"Other Top Courses"}/>
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {differentCourses.map((course) => (
          <Link to={`/course/${course._id}`}key={course._id} className="bg-richblack-800 p-4 rounded cursor-pointer hover:scale-101 transition-all duration-300">
            <img src={course.thumbnail} className="rounded w-[100%] h-[300px]" />
            <h3 className="mt-2">{course.courseName}</h3>
          </Link>
        ))}
      </div>

        
    </div>
  );
};

export default Catalog;