const communityDB = require("../models/communityModel");
const deityDB = require("../models/deityModel");
const chatsDB = require("../models/chatsModel")
const messageDB = require("../models/messageModel");
const userDB = require("../models/userModel")
const postsDB = require("../models/postModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Community routes established");
})

const createCommunity = asynchandler(async (req, res) => {
    const { name, description, deityId } = req.body;
    if (!name || !description || !req.file || !deityId) {
        return response.validationError(res, "Fill in all the details");
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    const newCommunity = new communityDB({
        name: name,
        displayImage: uploadedData.secure_url,
        description: description,
        subscribers: [],
        posts: [],
        deityId: deityId
    });
    const savedCommunity = await newCommunity.save();
    if (savedCommunity) {
        const updateDeity = await deityDB.findByIdAndUpdate({ _id: deityId }, {
            $push: { communities: savedCommunity._id }
        }, { new: true });


        if (updateDeity) {
            const newChats = new chatsDB({
                communityId: savedCommunity._id,
                chat: []
            });
            const savedChat = await newChats.save();
            if (savedChat) {
                response.successResponse(res, savedCommunity, "Created community successfully");
            }
            else {
                response.internalServerError(res, 'Failed to create chat related to the community');
            }
        }
        else {
            response.internalServerError(res, 'Created community but failed to add it to deity');
        }
    }
    else {
        response.internalServerError(res, "Failed to create the community")
    }
})

//update community details
const updateCommunityDetails = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a community without its id');
        return;
    }
    const findCommunity = await communityDB.findById({ _id: id });
    // console.log(findCommunity)
    if (findCommunity) {
        const updateData = {};
        // console.log(req.body)
        const { name, description, deityId } = req.body;
        // console.log(name)
        if (name) {
            updateData.name = name;
        }
        if (description) {
            updateData.description = description;
        }
        if (deityId) {
            updateData.deityId = deityId;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            });
            updateData.displayImage = uploadedData.secure_url;
            const deletedCloudData=await cloudinary.uploader.destroy(findCommunity.displayImage)
        }
        // console.log(updateData)
        const updatedCommunity = await communityDB.findByIdAndUpdate({ _id: id },
            updateData
            , { new: true });
        console.log(updatedCommunity)
        if (updatedCommunity) {
            if (deityId) {
                const updateDeity1 = await deityDB.findByIdAndUpdate({ _id: deityId }, {
                    $push: { communities: id },
                }, { new: true });
                const deity2 = await deityDB.findById({ _id: findCommunity.deityId });
                const index = deity2.communities.indexOf(id);
                deity2.communities.splice(index, 1);
                await deity2.save();
                if (updateDeity1) {
                    response.successResponse(res, updatedCommunity, "Successfully updated the community");

                }
                else {
                    response.successResponse(res, updatedCommunity, "failed to update the deity but updated community")
                }
            }
            else {
                response.successResponse(res, updatedCommunity, "Successfully updated the community");

            }
        }
        else {
            response.internalServerError(res, "Failed to update the community")
        }

    }
    else {
        response.notFoundError(res, "Cannot find the community")
    }
})
//update followers
const updateFollower = asynchandler(async (req, res) => {
    const { userId } = req.params;
    if (userId == ":userId") {
        response.validationError(res, 'User id required as parament')
        return;
    }
    const { communityId } = req.body;
    if (!communityId) {
        response.validationError(res, "Cannot follow someone if id is not known")
        return;
    }
    const findUser = await userDB.findById({ _id: userId });
    if (findUser) {
        const findCommunity = await communityDB.findById({ _id: communityId });
        if (findCommunity) {
            if (findUser.communities.includes(communityId)) {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $pop: { communities: communityId }
                }, { new: true });
                const updatedCommunity = await communityDB.findByIdAndUpdate({ _id: communityId }, {
                    $pop: { subscribers: userId }
                }, { new: true });
                if (updatedUser && updatedCommunity) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to unfollow the community")
                }
            }
            else {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $push: { communities: communityId }
                }, { new: true });
                const updatedCommunity = await communityDB.findByIdAndUpdate({ _id: communityId }, {
                    $push: { subscribers: userId }
                }, { new: true });
                if (updatedUser && updatedCommunity) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to follow the community")
                }
            }
        }
        else {
            response.notFoundError(res, 'Cannot find the community');
        }
    }
    else {
        response.notFoundError(res, "Cannot the user.");
    }
})


//get all communities and deity wise
const getCommunities = asynchandler(async (req, res) => {
    const { deityId } = req.query;
    const queryObj = {};
    if (deityId) {
        queryObj.deityId = deityId
    }
    const findCommunities = await communityDB.find(queryObj).populate("subscribers");
    if (findCommunities) {
        response.successResponse(res, findCommunities, 'Successfully fetched the communites');
    }
    else {
        response.internalServerError(res, 'Failed to fetch the communities');
    }
})
//get a community

const getACommunity = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a community without its id');
        return;
    }
    const findCommunity = await communityDB.findById({ _id: id }).populate("subscribers");
    if (findCommunity) {
        response.successResponse(res, findCommunity, 'Community found successfully');
    }
    else {
        response.notFoundError(res, "Cannot find the community")
    }
})
//delete communitites
const deleteCommunity = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a community without its id');
        return;
    }
    const findCommunity = await communityDB.findById({ _id: id });
    if (findCommunity) {

        const deletedCommunity = await communityDB.findByIdAndDelete({ _id: id });
        if (deletedCommunity) {
            const deleteAllPosts = await postsDB.deleteMany({
                _id: { $in: findCommunity.posts }
            });
            if (deleteAllPosts) {
                const deletedChats = chatsDB.findByIdAndDelete({ communityId: deletedCommunity._id })
                const deletedMessages = await messageDB.deleteMany({
                    _id: { $in: deletedChats.chat }
                })
                if (deletedChats && deletedMessages) {

                    response.successResponse(res, deletedCommunity, "Successfully deleted the community")

                }
                else {
                    response.successResponse(res, deletedCommunity, "deleted the community and posts but failed to delete the chats");
                }
            }
            else {
                response.successResponse(res, deletedCommunity, "deleted the community but failed to delete the posts");
            }
        }
        else {
            response.internalServerError(res, "Failed to delete the community")
        }
    }
    else {
        response.notFoundError(res, "Cannot find the community")
    }
})



module.exports = { test, createCommunity, updateCommunityDetails, updateFollower, deleteCommunity, getACommunity, getCommunities };