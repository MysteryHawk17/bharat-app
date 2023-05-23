const { test, createTemple, updateTemple, deleteTemple } = require("../controllers/templeController")

const router=require("express").Router()
const upload=require("../utils/multer");


router.get('/test',test);
router.post("/create",upload.single('image'),createTemple);
router.put("/updatetemple/:id",upload.single('image'),updateTemple)
router.delete("/deletetemple/:id",deleteTemple);

module.exports=router;