import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HighlightText from "../core/HomePage/HighlightText";
import { removeFromCart } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { buyNow } from "../../services/operations/paymentAPI";
import toast from "react-hot-toast";

const Cart = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const { cart, totalItems, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log(cart);
  const navigate=useNavigate();



  const handleBuyCart = () => {

  if (!user) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  if (user.accountType === "Instructor") {
    toast.error("Instructor cannot buy courses");
    return;
  }

  // 🔥 extract courseIds
  const courseIds = cart.map((course) => course._id);

  if (courseIds.length === 0) {
    toast.error("Cart is empty");
    return;
  }

  // 🔥 call payment API
  buyNow(token, courseIds, user,dispatch,navigate);
};


return (
  <div className="text-white px-10 py-12 max-w-[1200px] mx-auto">

    {/* HEADER */}
    <div className="mb-10">
      <h1 className="text-4xl font-bold mb-2">
        <HighlightText text={"Your Cart"} />
      </h1>
      <p className="text-richblack-300">
        {totalItems} {totalItems === 1 ? "course" : "courses"} in your cart
      </p>
    </div>

    {totalItems > 0 ? (
      <div className="flex gap-10 items-start">

        {/* LEFT - CART ITEMS */}
        <div className="w-[65%] flex flex-col gap-6">

          {cart.map((course) => (
            <div
              key={course._id}
              className="flex gap-5 bg-richblack-800 p-5 rounded-xl border border-richblack-700 hover:shadow-lg transition-all duration-200"
            >
              {/* IMAGE */}
              <img
                src={course.thumbnail}
                className="w-32 h-24 rounded-lg object-cover"
              />

              {/* DETAILS */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    {course.courseName}
                  </h2>

                  <p className="text-sm text-richblack-300 line-clamp-2">
                    {course.courseDescription}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => dispatch(removeFromCart(course._id))}
                  className="text-red-400 text-sm mt-3 hover:text-red-500 transition cursor-pointer"
                >
                  Remove
                </button>
              </div>

              {/* PRICE */}
              <div className="text-xl font-bold text-yellow-300">
                ₹ {course.price}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY CARD */}
        <div className="w-[35%] sticky top-24">

          <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md">

            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-richblack-300 mb-2">
              <span>Total Courses</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total Amount</span>
              <span className="text-yellow-300">₹ {total}</span>
            </div>

            <button onClick={handleBuyCart} className="w-full bg-yellow-300 cursor-pointer text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
              Buy Now
            </button>

          </div>

        </div>
      </div>

    ) : (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">

        <p className="text-xl text-richblack-300">
          Your cart is empty 🛒
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-yellow-300 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 cursor-pointer"
        >
          Go to Homepage
        </button>
      </div>
    )}
  </div>

)};
export default Cart;