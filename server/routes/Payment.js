// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/orders", auth, isStudent, capturePayment)
router.post("/orders/verify",auth, isStudent, verifyPayment)
//router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router


//const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
