const pageDB = require("../models/pageModel");
const communityDB = require("../models/communityModel")
const messageDB = require("../models/messageModel");
const userDB = require("../models/userModel")
const postsDB = require("../models/postModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Page routes established");
})

const createPage = asynchandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description || !req.file) {
        return response.validationError(res, "Fill in all the details");
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    const newPage = new pageDB({
        name: name,
        displayImage: uploadedData.secure_url,
        description: description,
        subscribers: [],
        posts: []
    });
    const savedPage = await newPage.save();
    if (savedPage) {
        const newCommunity = new communityDB({
            pageId: savedPage._id,
            chat: []
        });
        const savedCommunity = await newCommunity.save();
        if (savedCommunity) {
            response.successResponse(res, savedPage, "Created community successfully");
        }
        else {
            response.successResponse(res, savedPage, 'Cannot create chat but saved page successfully')
        }


    }
    else {
        response.internalServerError(res, "Failed to create the community")
    }
})

//update community details
const updatePageDetails = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a community without its id');
        return;
    }
    const findPage = await pageDB.findById({ _id: id });
    // console.log(findPage)
    if (findPage) {
        const updateData = {};
        // console.log(req.body)
        const { name, description} = req.body;
        // console.log(name)
        if (name) {
            updateData.name = name;
        }
        if (description) {
            updateData.description = description;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            });
            updateData.displayImage = uploadedData.secure_url;
            const deletedCloudData = await cloudinary.uploader.destroy(findPage.displayImage)
        }
        // console.log(updateData)
        const updatedPage = await pageDB.findByIdAndUpdate({ _id: id },
            updateData
            , { new: true });
        console.log(updatedPage)
        if (updatedPage) {
            response.successResponse(res, updatedPage, "Successfully updated the community");
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
    const { pageId } = req.body;
    if (!pageId) {
        response.validationError(res, "Cannot follow someone if id is not known")
        return;
    }
    const findUser = await userDB.findById({ _id: userId });
    if (findUser) {
        const findPage = await pageDB.findById({ _id: pageId });
        if (findPage) {
            if (findUser.pages.includes(pageId)) {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $pull: { pages: pageId }
                }, { new: true });
                const updatedPage = await pageDB.findByIdAndUpdate({ _id: pageId }, {
                    $pull: { subscribers: userId }
                }, { new: true });
                if (updatedUser && updatedPage) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to unfollow the community")
                }
            }
            else {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $push: { pages: pageId }
                }, { new: true });
                const updatedPage = await pageDB.findByIdAndUpdate({ _id: pageId }, {
                    $push: { subscribers: userId }
                }, { new: true });
                if (updatedUser && updatedPage) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to follow the page")
                }
            }
        }
        else {
            response.notFoundError(res, 'Cannot find the page');
        }
    }
    else {
        response.notFoundError(res, "Cannot the user.");
    }
})


//get all communities and deity wise
const getPages = asynchandler(async (req, res) => {
    const { deityId } = req.query;
    const queryObj = {};
    if (deityId) {
        queryObj.deityId = deityId
    }
    const findPages = await pageDB.find(queryObj).populate("subscribers");
    if (findPages) {
        response.successResponse(res, findPages, 'Successfully fetched the pages');
    }
    else {
        response.internalServerError(res, 'Failed to fetch the pages');
    }
})
//get a page

const getAPage = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a page without its id');
        return;
    }
    const findPage = await pageDB.findById({ _id: id }).populate("subscribers");
    if (findPage) {
        response.successResponse(res, findPage, 'Community found successfully');
    }
    else {
        response.notFoundError(res, "Cannot find the page")
    }
})
//delete communitites
const deletePage = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a page without its id');
        return;
    }
    const findPage = await pageDB.findById({ _id: id });
    if (findPage) {

        const deletedPage = await pageDB.findByIdAndDelete({ _id: id });
        if (deletedPage) {
            const deleteAllPosts = await postsDB.deleteMany({
                _id: { $in: findPage.posts }
            });
            if (deleteAllPosts) {
                const deletedChats = communityDB.findByIdAndDelete({ pageId: deletedPage._id })
                const deletedMessages = await messageDB.deleteMany({
                    _id: { $in: deletedChats.chat }
                })
                if (deletedChats && deletedMessages) {

                    response.successResponse(res, deletedPage, "Successfully deleted the page")

                }
                else {
                    response.successResponse(res, deletedPage, "deleted the page and posts but failed to delete the chats");
                }
            }
            else {
                response.successResponse(res, deletedPage, "deleted the page but failed to delete the posts");
            }
        }
        else {
            response.internalServerError(res, "Failed to delete the page")
        }
    }
    else {
        response.notFoundError(res, "Cannot find the page")
    }
})



module.exports = { test, createPage, updatePageDetails, updateFollower, deletePage, getAPage, getPages };