const { uploadSong, getAllSongs, getASong, updateSong, deleteSong, test } = require("../controllers/songController");

const router=require("express").Router();
const upload=require("../utils/songMulter");
router.get("/test",test);
router.post("/uploadsong",upload.single('song'),uploadSong);
router.get("/getallsong",getAllSongs);
router.get('/getasong/:id',getASong);
router.put("/updatesong/:id",upload.single('song'),updateSong);
router.delete("/deletesong/:id",deleteSong);

module.exports=router;