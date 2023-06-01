const { test, createTyohar, updateTyohar, deleteTyohar, getByPopularity, getByMonth, upcomingTyohar, getATyohar } = require("../controllers/tyoharController");

const router=require("express").Router();
const upload=require("../utils/multer");


router.get("/test",test);
router.post("/create",upload.single('image'),createTyohar);
router.put("/updatetyohar/:id",upload.single("image"),updateTyohar);
router.delete("/deletetyohar/:id",deleteTyohar);
router.get("/getbypopularity",getByPopularity);
router.get("/getbymonth",getByMonth);
router.get("/upcomingtyohar",upcomingTyohar);
router.get("/getatyohar/:id",getATyohar);

module.exports=router;