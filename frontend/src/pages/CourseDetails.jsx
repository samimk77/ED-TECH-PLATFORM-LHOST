import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CourseDetailsCard from "../components/core/HomePage/CourseDetailsCard";
import Spinner from "../components/common/Spinner";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const [loading,setLoading]=useState(false)

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await apiConnector(
        "GET",
        categories.COURSE_DETAILS_API(courseId)
      );
      setCourseData(res.data.data[0]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch course details");
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchCourseDetails();
  }, []);

    if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size={40} />
      </div>
    )
  }

  if (!courseData) return <div className="text-white">No details available...</div>;

  // ✅ all checks after courseData is loaded
  const isEnrolled = user?.courses?.includes(courseId);
  const isInstructor = user?.accountType === "Instructor";
  const isOwner =
    courseData?.instructor?._id === user?._id ||
    courseData?.instructor === user?._id;

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="text-white p-10 flex gap-10">

      {/* LEFT SIDE */}
      <div className="w-[70%]">

        {/* COURSE TITLE */}
        <h1 className="text-3xl font-bold">{courseData.courseName}</h1>

        {/* DESCRIPTION */}
        <p className="mt-2 text-richblack-300">{courseData.courseDescription}</p>

        {/* INSTRUCTOR */}
        <div className="flex items-center gap-2 mt-5">
          <img
            src={courseData?.instructor?.image}
            className="w-6 h-6 rounded-full object-cover"
          />
          <p>Course created by: {courseData?.instructor?.firstName}</p>
        </div>

        {/* WHAT YOU'LL LEARN */}
        <div className="mt-6 p-4 border border-richblack-700 rounded">
          <h2 className="text-xl font-semibold">What you'll learn</h2>
          <p className="mt-2">{courseData.whatYouWillLearn}</p>
        </div>

        {/* COURSE CONTENT — visible to enrolled students OR any instructor */}
        {isEnrolled || (isInstructor && isOwner )? (
          <>
            {/* VIDEO PLAYER */}
            {videoUrl && (
              <div className="mt-6">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full rounded"
                />
              </div>
            )}

            {/* SECTIONS */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Course Content</h2>

              {courseData.courseContent.map((section) => (
                <div
                  key={section._id}
                  className="mb-3 border border-richblack-700 rounded"
                >
                  {/* SECTION HEADER */}
                  <div
                    onClick={() => toggleSection(section._id)}
                    className="flex justify-between items-center p-3 bg-richblack-800 cursor-pointer hover:bg-richblack-700 transition"
                  >
                    <h3 className="font-semibold">{section.sectionName}</h3>

                    <div className="flex items-center gap-3">

                      {/* EDIT BUTTON — only for owner instructor */}
                      {isInstructor && isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/edit-course/${courseId}`);
                          }}
                          className="text-yellow-300 text-xs border border-yellow-300 px-2 py-1 rounded hover:bg-yellow-300 hover:text-black transition"
                        >
                          ✏️ Edit
                        </button>
                      )}

                      <span>
                        {activeSection === section._id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* SUBSECTIONS */}
                  {activeSection === section._id && (
                    <div className="p-3">
                      {section.subSection.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex justify-between items-center ml-2 mt-2 text-sm bg-richblack-700 px-3 py-2 rounded hover:bg-richblack-600 transition cursor-pointer"
                        >
                          {/* LEFT — click to play (only for students) */}
                          <div
                            className="flex items-center gap-2 flex-1"
                            onClick={() => {
                              if (!isInstructor) setVideoUrl(sub.videoUrl);
                            }}
                          >
                            🎥
                            <p>{sub.title}</p>
                          </div>

                          {/* RIGHT — edit button for owner, duration for students */}
                          {isInstructor && isOwner ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/edit-course/${courseId}`);
                              }}
                              className="text-yellow-300 text-xs border border-yellow-300 px-2 py-1 rounded hover:bg-yellow-300 hover:text-black transition"
                            >
                              ✏️ Edit
                            </button>
                          ) : (
                            <span className="text-yellow-200">
                              {sub.timeDuration || "0:00"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 text-center text-lg text-yellow-200">
            🔒 Buy the course to view contents
          </div>
        )}
      </div>

      {/* RIGHT SIDE CARD */}
      <CourseDetailsCard
        courseData={courseData}
        isInstructor={isInstructor}
        isOwner={isOwner}
      />
    </div>
  );
};

export default CourseDetails;