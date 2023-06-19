const userDB = require("../models/userModel");
const dietyDB = require("../models/deityModel")
const communityDB = require("../models/communityModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require("express-async-handler")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'User routes established');
})

const updateLanguage = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a user without the id');
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("communities").populate("followers").populate("followings");
    if (findUser) {
        const { language } = req.body;
        if (!language) {
            response.validationError(res, 'Cannot update the language without the language');
            return;
        }
        const updatedUser = await userDB.findByIdAndUpdate({ _id: id }, {
            language: language
        }, { new: true });
        if (updatedUser) {
            response.successResponse(res, updatedUser, "Successfully updated the language of the user");
        }
        else {
            response.internalServerError(res, 'Failed to update the language of the users');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the user');
    }
})
const getAllUsers = asynchandler(async (req, res) => {
    const allUsers = await userDB.find().populate("communities").populate("followers").populate("followings");
    if (allUsers) {
        response.successResponse(res, allUsers, "Successfully fetched all the users");
    }
    else {
        response.internalServerError(res, "Error in fetching the users");
    }
})
const getUser = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a user without the id');
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("communities").populate("followers").populate("followings");
    if (findUser) {
        response.successResponse(res, findUser, "Successfully fetched the user")
    }
    else {
        response.notFoundError(res, 'Cannot find the user');
    }
})
const addCommunityAtSignin = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a user without the id');
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("communities").populate("followers").populate("followings");
    if (findUser) {
        const { dietyIdArray } = req.body;
        if (!dietyIdArray) {
            return response.validationError(res, 'Cannot begin without selecting atleast one deity');
        }
        var newArrayOfIds = [];
        dietyIdArray.map(async (e) => {
            const findDeity = await dietyDB.findById({ _id: e });
            if (findDeity) {
                newArrayOfIds = [...newArrayOfIds, ...findDeity.communities]
            }
            else {
                response.internalServerError(res, 'Cannot add the deity.');
            }
        })
        const updatedUser = await userDB.findByIdAndUpdate({ _id: id }, {
            communities: newArrayOfIds
        }, { new: true });
        const updatedCommunities = await communityDB.updateMany({
            _id: { $in: newArrayOfIds }
        }, { $push: { subscribers: id } }, { new: true });
        if (updatedUser) {
            response.successResponse(res, updatedUser, "Successfully updated the user");
        }
        else {
            response.internalServerError(res, "Cannot update the intrests of the user");
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the user');
    }
})
const updateProfile = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ':id') {
        response.validationError(res, 'Cannot find a user without the id');
        return;
    }
    const findUser = await userDB.findById({ _id: id }).populate("communities").populate("followers").populate("followings");
    if (findUser) {
        const updateData = {};
        const { name } = req.body;
        if (name) {
            updateData.name = name;
        }
        const updatedData = await userDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedData) {
            response.successResponse(res, updatedData, "Successfully updated the user");
        }
        else {
            response.internalServerError(res, 'Failed to update the user');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the user');
    }
})


//follow //unfollow someone

const updateFollower = asynchandler(async (req, res) => {
    const { userId } = req.params;
    if (userId == ":userId") {
        response.validationError(res, 'User id required as parament')
        return;
    }
    const { toFollowId } = req.body;
    if (!toFollowId) {
        response.validationError(res, "Cannot follow someone if id is not known")
        return;
    }
    const findUser = await userDB.findById({ _id: userId });
    if (findUser) {
        const findFollowing = await userDB.findById({ _id: toFollowId });
        if (findFollowing) {
            if (findUser.followings.includes(toFollowId)) {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $pop: { followings: toFollowId }
                }, { new: true });
                const updatedPeson = await userDB.findByIdAndUpdate({ _id: toFollowId }, {
                    $pop: { followers: userId }
                }, { new: true });
                if (updatedUser && updatedPeson) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to unfollow the user")
                }
            }
            else {
                const updatedUser = await userDB.findByIdAndUpdate({ _id: userId }, {
                    $push: { followings: toFollowId }
                }, { new: true });
                const updatedPeson = await userDB.findByIdAndUpdate({ _id: toFollowId }, {
                    $push: { followers: userId }
                }, { new: true });
                if (updatedUser && updatedPeson) {
                    response.successResponse(res, updatedUser, "Success")
                }
                else {
                    response.internalServerError(res, "Unable to follow the user")
                }
            }
        }
        else {
            response.notFoundError(res, 'Cannot find whom to follow');
        }
    }
    else {
        response.notFoundError(res, "Cannot the user.");
    }
})

module.exports = { test, getAllUsers, getUser, updateFollower, updateLanguage, addCommunityAtSignin, updateProfile }