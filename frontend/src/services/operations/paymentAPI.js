import { apiConnector } from "../apiConnector";
import { categories } from "../apis";
import toast from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";

function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const buyNow = async (token, courses, user,dispatch,navigate) => {
    
  const toastId = toast.loading("Processing payment...");
  try {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      categories.CREATE_ORDER_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    console.log("Order response:", orderResponse.data);

    if (!orderResponse.data.success) {
      toast.error("Could not create order");
      return;
    }

    // ✅ Your backend returns order inside "message" field
    const { message } = orderResponse.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: message.amount,      // ✅ from message
      currency: message.currency,  // ✅ from message
      order_id: message.id,        // ✅ critical — this makes razorpay return all 3 fields
      name: "STUDY NOTION",
      description: "Course Purchase",

      handler: async function (response) {
        console.log("Razorpay response:", response); // should now have all 3 fields

        try {
          const verifyResponse = await apiConnector(
            "POST",
            categories.VERIFY_PAYMENT_API,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courses,
            },
            { Authorization: `Bearer ${token}` }
          );

          console.log("Verify response:", verifyResponse);

          if (verifyResponse.data.success) {
            toast.success("Payment successful! You are now enrolled.");

              // ✅ FETCH UPDATED USER
            const updatedUserRes = await apiConnector(
              "GET",
              categories.GET_USER_DETAILS_API,
                null,
              {
                Authorization: `Bearer ${token}`,
              }
  );

              // ✅ UPDATE REDUX
              if(updatedUserRes){
            dispatch(setUser(updatedUserRes.data.data));
             localStorage.setItem("user", JSON.stringify(updatedUserRes.data.data));
              
              }


  console.log("updatedUserRes:", updatedUserRes.data);        // ← what's here?
  console.log("user:", updatedUserRes.data.user);             // ← is this undefined?
  console.log("success:", updatedUserRes.data.success);  

              navigate(`/course/${courses[0]}`);
              
            //clear cart
            dispatch(resetCart())
            
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          toast.error("Payment verification error");
          console.log("Verify error:", error.response?.data);
        }
      },

      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },

      theme: {
        color: "#FFD60A",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
    toast.error("Payment failed");
    console.log(error);
  } finally {
    toast.dismiss(toastId);
  }
};