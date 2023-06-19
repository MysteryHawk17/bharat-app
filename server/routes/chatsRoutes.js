const { test, createMessage, getChat, deleteMessage, updateMessage } = require("../controllers/chatControllers");

const router = require("express").Router();





router.get("/test", test);
router.post("/create/message/:chatId", createMessage);
router.get("/getcommunitychat/:communityId", getChat)
router.delete("/deletemessage/:chat", deleteMessage)
router.patch("/updatemessage/:messageId", updateMessage)

module.exports = router;