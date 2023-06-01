const { test, createLiterature, getAllLiterature, getALiteratrue, updateLiterature, deleteLiterature } = require("../controllers/literatureController");

const router = require("express").Router();


router.get("/test", test);
router.post("/create", createLiterature);
router.get("/getallliterature", getAllLiterature);
router.get("/getaliterature/:id", getALiteratrue);
router.put("/updateliterature/:id", updateLiterature);
router.delete("/deleteliterature/:id", deleteLiterature);
module.exports = router;