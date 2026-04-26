const express = require("express")
const router=express.Router()
const {contactUs} = require("../controllers/ContactUs")

router.post("/",contactUs)

module.exports=router;