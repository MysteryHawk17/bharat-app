const { test, createUser, loginUser, sendOtp, verifyOTP, changePassword, resetPassword } = require("../controllers/authController");

const router = require("express").Router();
const { checkLogin } = require("../middlewares/authMiddleware");

router.get("/test", test)
router.post("/register", createUser);
router.post("/login", loginUser)
router.post("/sendOtp", sendOtp)
router.post("/verifyotp", verifyOTP)
router.post("/changepassword", checkLogin, changePassword);
router.post("/resetpassword", resetPassword);
module.exports = router;