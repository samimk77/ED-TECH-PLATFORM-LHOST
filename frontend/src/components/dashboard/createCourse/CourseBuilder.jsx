import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiConnector } from "../../../services/apiConnector";
import { categories } from "../../../services/apis";


const CourseBuilder = ({ setStep, courseId }) => {
  const { token } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [sectionName, setSectionName] = useState("");

  // lecture form
  const [lectureData, setLectureData] = useState({
    title: "",
    description: "",
    videoFile: null,
    sectionId: null,
  });

  // 🔥 FETCH COURSE
  const fetchCourse = async () => {
    try {
      const res = await apiConnector(
        "GET",
        categories.COURSE_DETAILS_API(courseId)
      );
      setCourse(res.data.data[0]);
    } catch {
      toast.error("Failed to load course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // 🔥 CREATE SECTION
  const handleCreateSection = async () => {
    if (!sectionName) return toast.error("Enter section name");

    try {
      await apiConnector(
        "POST",
        categories.CREATE_SECTION_API(courseId),
        { sectionName },
        { Authorization: `Bearer ${token}` }
      );

      toast.success("Section created");
      setSectionName("");
      fetchCourse();
    } catch {
      toast.error("Failed to create section");
    }
  };

  // 🔥 DELETE SECTION
  const handleDeleteSection = async (sectionId) => {
    try {
      await apiConnector(
        "DELETE",
        categories.DELETE_SECTION_API(courseId, sectionId),
        null,
        { Authorization: `Bearer ${token}` }
      );

      toast.success("Section deleted");
      fetchCourse();
    } catch {
      toast.error("Section Delete failed");
    }
  };

  // 🔥 ADD LECTURE
  const handleAddLecture = async () => {

    const { title, description, videoFile, sectionId } = lectureData;

    if (!title || !description || !videoFile) {
      return toast.error("All fields required");
    }

    const toastId=toast.loading("Adding lecture...")


    try {

      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("sectionId", sectionId);
      data.append("videoFile", videoFile);

      await apiConnector(
        "POST",
        categories.CREATE_SUBSECTION_API(courseId, sectionId),
        data,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      toast.success("Lecture added");

      setLectureData({
        title: "",
        description: "",
        videoFile: null,
        sectionId: null,
      });

      fetchCourse();
    } catch {
        toast.dismiss(toastId);

      toast.error("Failed to add lecture");
    }
    finally{
        toast.dismiss(toastId);
    }
  };
        


  // 🔥 DELETE LECTURE
  const handleDeleteLecture = async (sectionId, subSectionId) => {
    try {
      await apiConnector(
        "DELETE",
        categories.DELETE_SUBSECTION_API(courseId, sectionId, subSectionId),
        null,
        { Authorization: `Bearer ${token}` }
      );

      toast.success("Lecture deleted");
      fetchCourse();
    } catch {
      toast.error("Subsection Delete failed");
    }
  };

  return (
    <div className="bg-richblack-800 p-6 rounded text-white">

      {/* ADD SECTION */}
      <div className="flex gap-3 mb-6">
        <input
          className="bg-richblack-700 p-2 rounded w-full"
          placeholder="New Section"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
        />
        <button
          onClick={handleCreateSection}
          className="bg-yellow-300 text-black px-4 py-2 rounded  cursor-pointer"
        >
          Add+
        </button>
      </div>

      {/* SHOW SECTIONS */}
      {course?.courseContent?.map((section) => (
        <div key={section._id} className="mb-5 border p-4 rounded">

          {/* SECTION HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{section.sectionName}</h3>

            <button
              onClick={() => handleDeleteSection(section._id)}
              className="text-red-400 cursor-pointer"
            >
              Delete Section
            </button>
          </div>

          {/* LECTURES */}
          {section.subSection?.map((sub) => (
            <div
              key={sub._id}
              className="ml-4 mt-2 flex justify-between items-center bg-richblack-700 p-2 rounded"
            >
              <p>{sub.title}</p>

              <button
                onClick={() =>
                  handleDeleteLecture(section._id, sub._id)
                }
                className="text-red-400 cursor-pointer text-sm"
              >
                ❌
              </button>
            </div>
          ))}

          {/* ADD LECTURE FORM */}
          <div className="mt-4 ml-4 flex flex-col gap-2">

            <input
              placeholder="Lecture Title"
              value={lectureData.sectionId === section._id ? lectureData.title : ""}
              onChange={(e) =>
                setLectureData({
                  ...lectureData,
                  title: e.target.value,
                  sectionId: section._id,
                })
              }
              className="bg-richblack-700 p-2 rounded"
            />

            <input
              placeholder="Description"
              value={lectureData.sectionId === section._id ? lectureData.description : ""}
              onChange={(e) =>
                setLectureData({
                  ...lectureData,
                  description: e.target.value,
                  sectionId: section._id,
                })
              }
              className="bg-richblack-700 p-2 rounded"
            />

            <input
              type="file"
              onChange={(e) =>
                setLectureData({
                  ...lectureData,
                  videoFile: e.target.files[0],
                  sectionId: section._id,
                })
              }
              className="text-sm bg-blue-400 rounded-md p-2 mt-2 w-[20%] text-black cursor-pointer"
            />

            <button
              onClick={handleAddLecture}
              className="text-yellow-300 cursor-pointer"
            >
              + Add Lecture
            </button>

          </div>

        </div>
      ))}

      {/* NEXT BUTTON */}
      <button
        onClick={() => setStep(3)}
        className="bg-yellow-300 text-black px-4 py-2 rounded mt-4 cursor-pointer"
      >
        Next
      </button>

    </div>
  );
};

export default CourseBuilder;