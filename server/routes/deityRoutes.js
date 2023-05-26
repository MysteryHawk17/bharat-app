const { test, createDeity, getAllDiety, getOneDeity, updateDeity, deleteDeity, getAllSongs } = require("../controllers/deityController");

const router=require("express").Router();
const upload=require("../utils/multer")

 
router.get("/test",test);
router.post("/createdeity",upload.single('image'),createDeity);
router.get("/getalldeity",getAllDiety);
router.get("/getdeity/:id",getOneDeity);
router.get("/getallsongs/:id",getAllSongs);
router.put("/updatedeity/:id",upload.single("image"),updateDeity);
router.delete("/deletedeity/:id",deleteDeity);


module.exports=router;