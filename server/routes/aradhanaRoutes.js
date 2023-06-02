const { test, createAradhaya, updateAradhaya, deleteAradhaya, getAllAradhaya, getAAradhaya, getSongs } = require("../controllers/aradhanaControllers");

const router = require("express").Router();
const upload = require("../utils/multer");


router.get("/test", test);
router.post("/create", upload.single('image'), createAradhaya);
router.put("/updatearadhaya/:id", upload.single("image"), updateAradhaya);
router.delete("/deletearadhaya/:id", deleteAradhaya);
router.get("/getallaradhaya", getAllAradhaya);
router.get("/getaradhaya/:id", getAAradhaya);
router.get("/songs/:id", getSongs)

module.exports = router