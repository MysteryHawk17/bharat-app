const { test, createDeity, getAllDiety, getOneDeity, updateDeity, deleteDeity } = require("../controllers/deityController");

const router=require("express").Router();
const upload=require("../utils/multer")


router.get("/test",test);
router.post("/createdeity",upload.single('image'),createDeity);
router.get("/getalldeity",getAllDiety);
router.get("/getdeity/:id",getOneDeity);
router.put("/updatedeity/:id",upload.single("image"),updateDeity);
router.delete("/deletedeit/:id",deleteDeity);


module.exports=router;