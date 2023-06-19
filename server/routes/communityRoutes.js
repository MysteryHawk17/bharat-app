const { test, createCommunity, updateFollower, updateCommunityDetails, getCommunities, getACommunity, deleteCommunity } = require("../controllers/communiyController");


const router = require("express").Router(); 
const upload=require("../utils/multer")




router.get("/test", test);
router.post("/create",upload.single("image"), createCommunity);
router.patch("/followcommunity/:userId", updateFollower)
router.put("/updatecommunitydetails/:id",upload.single("image"), updateCommunityDetails);
router.get("/getallcommunities", getCommunities);
router.get("/getacommunity/:id", getACommunity);
router.delete("/deletecommunity/:id", deleteCommunity);



module.exports = router;