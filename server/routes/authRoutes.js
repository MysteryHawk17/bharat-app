const { test, createUser, loginUser, resendOTP, verifyOTP } = require("../controllers/authController");

const router = require("express").Router();


router.get("/test", test)
router.post("/register", createUser);
router.post("/login", loginUser)
router.post("/resendotp", resendOTP)
router.post("/verifyotp", verifyOTP)
module.exports = router;