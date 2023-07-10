const { test, updateFollower, createPage, updatePageDetails, getPages, getAPage, deletePage } = require("../controllers/pageController");


const router = require("express").Router(); 
const upload=require("../utils/multer")




router.get("/test", test);
router.post("/create",upload.single("image"), createPage);
router.patch("/followpage/:userId", updateFollower)
router.put("/updatepagedetails/:id",upload.single("image"), updatePageDetails);
router.get("/getallpages", getPages);
router.get("/getapage/:id", getAPage);
router.delete("/deletepage/:id", deletePage);



module.exports = router;