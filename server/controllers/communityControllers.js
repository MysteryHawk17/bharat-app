const communityDB = require("../models/communityModel");
const messageDB = require("../models/messageModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Chats routes established");
})

const getCommunity = asynchandler(async (req, res) => {
    const { pageId } = req.params;
    if (!pageId) {
        response.validationError(res, 'Cannot fetch chat without the community id');
        return;
    }
    const fetchCommunity = await communityDB.findOne({ pageId: pageId }).populate({
        path:'chat',
            populate:{
                path:'userId'
            }
    });
    if (fetchCommunity) {
        response.successResponse(res, fetchCommunity, 'Fethced the communities successfully');
    }
    else {
        response.notFoundError(res, "Cannot find the communities assotiated with the id");
    }
})

const createMessage = asynchandler(async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;
    const communityId = req.params.communityId;
    if (!userId || !message || communityId == ":communityId") {
        return response.validationError(res, "Cannot create a chat with improper details");
    }
    const newMessage = new messageDB({
        userId,
        message,
    })
    const savedMessage = await newMessage.save();
    const findChats = await communityDB.findById({ _id: communityId }).populate("chat");
    if (findChats) {
        const newArray = [...findChats.chat, savedMessage._id];
        findChats.chat = newArray;
        await findChats.save();
        response.successResponse(res, findChats, "Message posted successfully")
    }
    else {
        response.notFoundError(res, 'Cannot find the chats');
    }
})

const deleteMessage = asynchandler(async (req, res) => {
    const { message } = req.body;
    const { communityId } = req.params;
    if (communityId == ":communityId") {
        return response.validationError(req, "Cannot update the community if id is not given");
    }
    if (!message) {
        return response.validationError(res, 'Cannot delete message without its id')
    }
    const findCommunity = await communityDB.findById({ _id: communityId });
    if (findCommunity) {
        const findIndex = findCommunity.chat.indexOf(message);
        if (findIndex > -1) {
            findCommunity.chat.splice(findIndex, 1);
            await findCommunity.save();
            const findMessage = await messageDB.findById({ _id: message });
            if (findMessage) {
                const deletedMessage = await messageDB.findByIdAndDelete({ _id: message });
                if (deletedMessage) {
                    response.successResponse(res, deletedMessage, "Successfully deleted the message");
                }
                else {
                    response.internalServerError(res, 'Failed to delete the message');
                }
            }
            else {
                response.successResponse(res, "Message deleted successfully")
            }
        }
        else {
            const findMessage = await messageDB.findById({ _id: message });
            if (findMessage) {
                const deletedMessage = await messageDB.findByIdAndDelete({ _id: message });
                if (deletedMessage) {
                    response.successResponse(res, deletedMessage, "Successfully deleted the message");
                }
                else {
                    response.internalServerError(res, 'Failed to delete the message');
                }
            }
            else {
                response.successResponse(res, "Message deleted successfully")
            }
        }
    }
    else {
        response.notFoundError(res, "Cannot found the chat to delete it.");
    }



})

const updateMessage = asynchandler(async (req, res) => {
    const { messageId } = req.params;
    if (messageId == ":messageId") {
        response.validationError(res, "Cannot edit message without its id");
        return;
    }
    const { message } = req.body;
    const findMessage = await messageDB.findById({ _id: messageId });
    if (findMessage) {
        const editedMessage = await messageDB.findByIdAndUpdate({ _id: messageId }, {
            message: message,
            isUpdated: true
        }, { new: true })
        if (editedMessage) {
            response.successResponse(res, editedMessage, 'Successfully edited the message')
        }
        else {
            response.internalServerError(res, "Failed to edit the message");
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the message to edit');
    }

})

module.exports = { test, createMessage, getCommunity, updateMessage, deleteMessage };