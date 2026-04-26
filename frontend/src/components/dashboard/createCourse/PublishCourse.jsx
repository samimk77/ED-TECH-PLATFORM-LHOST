import React, { useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";
import { categories } from "../../../services/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PublishCourse = ({ setStep, courseId }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!courseId) {
      return toast.error("Course not found");
    }

    try {
      setLoading(true);

      const res = await apiConnector(
        "PATCH",
        categories.PUBLISH_COURSE_API(courseId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(res);

      if (res.data.success) {
        toast.success("Course Published 🚀");

        // 🔥 redirect after publish
        navigate("/dashboard");
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Publish failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-richblack-800 p-6 rounded text-white flex flex-col gap-4">

      <h2 className="text-xl font-semibold">
        Publish Course
      </h2>

      <p className="text-richblack-300">
        Make your course live for students.
      </p>

      <div className="flex gap-4">

        {/* BACK */}
        <button
          onClick={() => setStep(2)}
          className="bg-richblack-700 px-4 py-2 rounded"
        >
          Back
        </button>

        {/* PUBLISH */}
        <button
          onClick={handlePublish}
          disabled={loading}
          className="bg-yellow-300 text-black px-4 py-2 rounded font-semibold cursor-pointer"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

      </div>
    </div>
  );
};

export default PublishCourse;