const { test, createMessage, deleteMessage, updateMessage, getCommunity, sharePost } = require("../controllers/communityControllers");

const router = require("express").Router();
const { checkLogin } = require("../middlewares/authMiddleware");




router.get("/test", test);
router.post("/create/message/:communityId",checkLogin, createMessage);
router.get("/getcommunitychat/:pageId", getCommunity)
router.delete("/deletemessage/:communityId",checkLogin, deleteMessage)
router.patch("/updatemessage/:messageId",checkLogin, updateMessage)
router.post("/share/post/:communityId",sharePost);
module.exports = router;