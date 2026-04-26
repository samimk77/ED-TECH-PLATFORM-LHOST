import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const ModifyCourse = () => {
  const { courseId } = useParams();
  console.log("courseId:", courseId);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  // Section edit state
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");

  // SubSection edit state
  const [editingSubSection, setEditingSubSection] = useState(null);
  const [editSubData, setEditSubData] = useState({
    title: "", description: "", video: null
  });

  // Add section state
  const [newSectionName, setNewSectionName] = useState("");

  // Add subsection state
  const [addingLectureToSection, setAddingLectureToSection] = useState(null);
  const [newLectureData, setNewLectureData] = useState({
    title: "", description: "", video: null,
  });

  const [loading,setLoading]=useState(false);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      const res = await apiConnector(
        "GET",
        categories.COURSE_DETAILS_API(courseId)
      );
      setCourseData(res.data.data[0]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch course");
    }
    setLoading(false);
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

  if (!courseData) return <div className="text-white">No course details available...</div>;

  // =====================
  // SECTION OPERATIONS
  // =====================

  const handleUpdateSection = async (sectionId) => {
    if (!editSectionName.trim()) return;
    const toastId = toast.loading("Updating section...");
    try {
      await apiConnector(
        "PUT",
        categories.UPDATE_SECTION_API(courseId, sectionId),
        { sectionName: editSectionName },
        {
           Authorization: `Bearer ${token}`
        }
      );
      toast.success("Section updated");
      setEditingSectionId(null);
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to update section");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const toastId = toast.loading("Deleting section...");
    try {
      await apiConnector(
        "DELETE",
        categories.DELETE_SECTION_API(courseId, sectionId),
        null,
        {
           Authorization: `Bearer ${token}`
        }
      );
      toast.success("Section deleted");
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to delete section");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    const toastId = toast.loading("Adding section...");
    try {
      await apiConnector(
        "POST",
        categories.CREATE_SECTION_API(courseId),
        { sectionName: newSectionName },
        { 
          Authorization: `Bearer ${token}`
        }
      );
      toast.success("Section added");
      setNewSectionName("");
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to add section");
    } finally {
      toast.dismiss(toastId);
    }
  };

  // =====================
  // SUBSECTION OPERATIONS
  // =====================

  const handleUpdateSubSection = async () => {
    if (!editSubData.title || !editSubData.description) {
      toast.error("Please fill all fields");
      return;
    }
    const toastId = toast.loading("Updating lecture...");
    try {
      const data = new FormData();
      data.append("subSectionId", editingSubSection._id);
      data.append("title", editSubData.title);
      data.append("description", editSubData.description);
      if (editSubData.video) data.append("video", editSubData.video);

      await apiConnector(
        "PUT",
        categories.UPDATE_SUBSECTION_API(courseId, editingSubSection.sectionId || activeSection || (courseData?.courseContent?.find(s => s.subSection?.some(sub => sub._id === editingSubSection._id))?._id), editingSubSection._id), // since activeSection might be available or we can find it
        data,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Lecture updated");
      setEditingSubSection(null);
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to update lecture");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const toastId = toast.loading("Deleting lecture...");
    try {
      await apiConnector(
        "DELETE",
        categories.DELETE_SUBSECTION_API(courseId, sectionId, subSectionId),
        null,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Lecture deleted");
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to delete lecture");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleAddLecture = async () => {

    if (!newLectureData.title || !newLectureData.video) {
      toast.error("Please fill all fields");
      return;
    }
    const toastId = toast.loading("Adding lecture...");
    try {
      const data = new FormData();
      data.append("sectionId", addingLectureToSection);
      data.append("title", newLectureData.title);
      data.append("description", newLectureData.description);
      data.append("videoFile", newLectureData.video);
      

      await apiConnector(
        "POST",
        categories.CREATE_SUBSECTION_API(courseId, addingLectureToSection),
        data,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Lecture added");
      setAddingLectureToSection(null);
      setNewLectureData({ title: "", description: "", video: null, timeDuration: "" });
      fetchCourseDetails();
    } catch (error) {
      toast.error("Failed to add lecture");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="text-white w-11/12 mx-auto mt-8">

      {/* COURSE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseData.courseName}</h1>
        <button
          onClick={() => navigate(-1)}
          className="border border-richblack-500 px-4 py-2 rounded hover:bg-richblack-700 cursor-pointer "
        >
          ←  Back
        </button>
      </div>

      {/* SECTIONS */}
      <div className="bg-richblack-800 p-6 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>

        {courseData.courseContent?.map((section) => (
          <div key={section._id} className="border border-richblack-600 rounded-md mb-3 overflow-hidden">

            {/* SECTION HEADER */}
            <div className="flex justify-between items-center p-3 bg-richblack-700">

              {/* SECTION NAME or EDIT INPUT */}
              {editingSectionId === section._id ? (
                <div className="flex gap-2 flex-1 mr-4">
                  <input
                    value={editSectionName}
                    onChange={(e) => setEditSectionName(e.target.value)}
                    className="flex-1 p-2 bg-richblack-600 rounded outline-none text-sm"
                  />
                  <button
                    onClick={() => handleUpdateSection(section._id)}
                    className="bg-yellow-300 text-black px-3 py-1 rounded text-sm font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSectionId(null)}
                    className="border border-richblack-500 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span
                  className="font-semibold cursor-pointer flex-1"
                  onClick={() => setActiveSection(activeSection === section._id ? null : section._id)}
                >
                  ☰ {section.sectionName}
                </span>
              )}

              {/* SECTION ACTIONS */}
              {editingSectionId !== section._id && (
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => { setEditingSectionId(section._id); setEditSectionName(section.sectionName); }}
                    className="text-richblack-300 hover:text-white text-sm cursor-pointer"
                  >✏️</button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="text-richblack-300 hover:text-red-400 text-sm cursor-pointer"
                  >🗑️</button>
                  <span
                    className="text-richblack-400 text-xs cursor-pointer"
                    onClick={() => setActiveSection(activeSection === section._id ? null : section._id)}
                  >
                    {activeSection === section._id ? "▲" : "▼"}
                  </span>
                </div>
              )}
            </div>

            {/* SUBSECTIONS */}
            {activeSection === section._id && (
              <div className="p-3 pl-8">
                {section.subSection?.map((sub) => (
                  <div key={sub._id} className="flex justify-between items-center p-2 bg-richblack-600 rounded mb-2 text-sm">
                    <span>🎥 {sub.title}</span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => { setEditingSubSection(sub); setEditSubData({ title: sub.title, description: sub.description, video: null }); }}
                        className="text-richblack-300 hover:text-white cursor-pointer"
                      >✏️</button>
                      <button
                        onClick={() => handleDeleteSubSection(sub._id, section._id)}
                        className="text-richblack-300 hover:text-red-400 cursor-pointer"
                      >🗑️</button>
                    </div>
                  </div>
                ))}

                {/* ADD LECTURE BUTTON */}
                <button
                  onClick={() => setAddingLectureToSection(section._id)}
                  className="text-yellow-300 text-sm mt-1 hover:text-yellow-400 cursor-pointer"
                >
                  + Add Lecture
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ADD NEW SECTION */}
        <div className="flex gap-2 mt-4">
          <input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Add a new section"
            className="flex-1 p-3 bg-richblack-700 rounded outline-none text-sm"
          />
          <button
            onClick={handleAddSection}
            className="bg-yellow-300 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 cursor-pointer"
          >
            + Add Section
          </button>
        </div>
      </div>

      {/* EDIT SUBSECTION MODAL */}
      {editingSubSection && (
        <div className="fixed inset-0 bg-richblack-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-richblack-800 p-6 rounded-md w-[500px] border border-richblack-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Lecture</h3>
              <button onClick={() => setEditingSubSection(null)} className="text-xl cursor-pointer">×</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Lecture Title *</label>
                <input
                  value={editSubData.title}
                  onChange={(e) => setEditSubData({ ...editSubData, title: e.target.value })}
                  className="p-3 bg-richblack-700 rounded outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Replace Video (optional)</label>
                <input type="file" accept="video/*"
                  onChange={(e) => setEditSubData({ ...editSubData, video: e.target.files[0] })}
                  className="p-2 bg-richblack-700 rounded outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Description *</label>
                <textarea
                  value={editSubData.description}
                  onChange={(e) => setEditSubData({ ...editSubData, description: e.target.value })}
                  rows={3} className="p-3 bg-richblack-700 rounded outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditingSubSection(null)}
                className="border border-richblack-500 px-4 py-2 rounded hover:bg-richblack-700 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpdateSubSection}
                className="bg-yellow-300 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400 cursor-pointer">
                Save Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LECTURE MODAL */}
      {addingLectureToSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-richblack-800 p-6 rounded-md w-[500px] border border-richblack-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Lecture</h3>
              <button onClick={() => setAddingLectureToSection(null)} className="text-xl">×</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Lecture Video *</label>
                <input type="file" accept="video/*"
                  onChange={(e) => setNewLectureData({ ...newLectureData, video: e.target.files[0] })}
                  className="p-2 bg-richblack-700 rounded outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Lecture Title *</label>
                <input
                  value={newLectureData.title}
                  onChange={(e) => setNewLectureData({ ...newLectureData, title: e.target.value })}
                  placeholder="Enter lecture title"
                  className="p-3 bg-richblack-700 rounded outline-none" />
              </div>
            
              <div className="flex flex-col gap-1">
                <label className="text-sm text-richblack-300">Description *</label>
                <textarea
                  value={newLectureData.description}
                  onChange={(e) => setNewLectureData({ ...newLectureData, description: e.target.value })}
                  rows={3} className="p-3 bg-richblack-700 rounded outline-none resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setAddingLectureToSection(null)}
                className="border border-richblack-500 px-4 py-2 rounded hover:bg-richblack-700">
                Cancel
              </button>
              <button onClick={handleAddLecture}
                className="bg-yellow-300 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400">
                Save Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyCourse;