import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import { HiShare } from "react-icons/hi";
import copy from "copy-to-clipboard";
import { addToCart } from '../../../slices/cartSlice';
import { buyNow } from '../../../services/operations/paymentAPI';

// Accept props instead of fetching own data
const CourseDetailsCard = ({ courseData: courseDetails, isInstructor, isOwner }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // Computed after props arrive
  const isEnrolled =
    user?.courses?.includes(courseDetails?._id) ||
    courseDetails?.studentsEnrolled?.includes(user?._id);

  if (!courseDetails) return null; //  parent already handles loading

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      toast.error("Please login to buy course");
      return;
    }
    if (user?.accountType === "Instructor") {
      toast.error("Instructor cannot buy course");
      return;
    }
    if (token) {
      dispatch(addToCart(courseDetails));
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      toast.error("Please login to buy course");
      return;
    }
    if (user?.accountType === "Instructor") {
      toast.error("Instructors cannot buy courses");
      return;
    }
    buyNow(token, [courseDetails._id], user, dispatch, navigate);
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied");
  };

  return (
    <div className="w-[30%] bg-richblack-800 p-4 rounded h-fit sticky top-10">

      <img src={courseDetails.thumbnail} className="rounded w-full" />

      <p className="text-2xl font-bold mt-4">₹ {courseDetails.price}</p>

      {/*  3 conditions — owner instructor / enrolled student / non-enrolled */}
      {isInstructor && isOwner ? (
        // OWNER INSTRUCTOR — edit course
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => navigate(`/dashboard/edit-course/${courseDetails._id}`)}
            className="bg-yellow-300 text-black w-full py-2 rounded cursor-pointer hover:bg-yellow-400 font-semibold"
          >
            ✏️ Edit Course
          </button>
        </div>

      ) : isEnrolled ? (
        // ENROLLED STUDENT — go to course
        <button
          onClick={() => navigate(`/course/${courseDetails._id}`)}
          className="bg-green-500 text-white w-full mt-4 py-2 rounded cursor-pointer hover:bg-green-600"
        >
          Go to Course
        </button>

      ) : (
        // NON-ENROLLED — buy or add to cart
        <>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-300 text-black w-full mt-4 py-2 rounded cursor-pointer hover:bg-yellow-400"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-richblack-600 w-full mt-2 py-2 rounded cursor-pointer hover:bg-richblack-700"
          >
            Buy Now
          </button>
        </>
      )}

      {/* SHARE */}
      <div
        onClick={handleShare}
        className="flex items-center justify-center mt-10 gap-2 text-yellow-200 cursor-pointer"
      >
        <h1>Share</h1>
        <HiShare />
      </div>
    </div>
  );
};

export default CourseDetailsCard;