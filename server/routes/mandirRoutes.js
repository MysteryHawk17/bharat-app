const { test, createMandir, getAllMandir, getAMandir, updateMandir, deleteMandir } = require("../controllers/mandirController");

const router = require("express").Router();
const upload = require("../utils/multer");


router.get("/test", test);
router.post("/create", upload.single('image'), createMandir);
router.get("/getallmandir", getAllMandir);
router.get("/getamandir/:id", getAMandir);
router.put("/updatemandir/:id", upload.single('image'), updateMandir);
router.delete("/deletemandir/:id", deleteMandir);

module.exports = router