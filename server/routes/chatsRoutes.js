const { test, createMessage, getChat, deleteMessage, updateMessage } = require("../controllers/chatControllers");

const router = require("express").Router();
const { checkLogin } = require("../middlewares/authMiddleware");




router.get("/test", test);
router.post("/create/message/:chatId",checkLogin, createMessage);
router.get("/getcommunitychat/:communityId", getChat)
router.delete("/deletemessage/:chat",checkLogin, deleteMessage)
router.patch("/updatemessage/:messageId",checkLogin, updateMessage)

module.exports = router;