const { test, getAllUsers, getUser, updateLanguage, addCommunityAtSignin, updateProfile, updateFollower } = require("../controllers/userController");

const router = require("express").Router();


router.get("/test", test)
router.get("/getalluser", getAllUsers);
router.get("/getuser/:id", getUser);
router.patch("/updatelanguage/:id", updateLanguage)
router.patch("/selectcommunities/:id", addCommunityAtSignin)
router.patch("/updateprofile/:id", updateProfile);
router.patch("/updatefollower/:userId", updateFollower)


module.exports = router;