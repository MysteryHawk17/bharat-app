const postDB = require("../models/postModel");
const pageDB = require("../models/pageModel")
const response = require("../middlewares/responsemiddleware");
const userDB = require("../models/userModel");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Post routes established");
})

//create a post
const createPost = asynchandler(async (req, res) => {
    const { pageId, caption } = req.body;
    if (!pageId || !caption || !req.file) {
        return response.validationError(res, 'Please fill the details to create a post');
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    const newPost = new postDB({
        pageId: pageId,
        caption: caption,
        image: uploadedData.secure_url,
        reaction: [],
        comments: []
    });
    const savedPost = await newPost.save();
    if (savedPost) {
        const updatePage = await pageDB.findByIdAndUpdate({ _id: pageId }, {
            $push: { posts: savedPost._id }
        });
        if (updatePage) {
            response.successResponse(res, savedPost, 'Created the post successfully');
        }
        else {
            response.successResponse(res, savedPost, 'Created post successfully but failed to add to the page');
        }
    }
    else {
        response.internalServerError(res, 'Cannot create post.')
    }
})
//update a post
const updatePost = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        response.validationError(res, 'Cannot get the post without its id');
        return;
    }
    const findPost = await postDB.findById({ _id: id });
    if (findPost) {
        const updateData = {};
        const { caption } = req.body;
        if (caption) {
            updateData.caption = caption;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            });
            updateData.image = uploadedData.secure_url;
        }
        const deletedImage = await cloudinary.uploader.destroy(findPost.image);
        const updatedPost = await postDB.findByIdAndUpdate({ _id: id }, updateData, {
            new: true
        });
        if (updatedPost) {
            response.successResponse(res, updatedPost, 'Successfully updated the posts');
        }
        else {
            response.internalServerError(res, 'Failed to update the paths');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the post');
    }
})
//delete a post
const deletePost = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        response.validationError(res, 'Cannot get the post without its id');
        return;
    }
    const findPost = await postDB.findById({ _id: id });
    if (findPost) {
        const deleteFromCloudinary = await cloudinary.uploader.destroy(findPost.image);
        const deletedPost = await postDB.findByIdAndDelete({ _id: id });
        if (deletedPost) {
            const updatePage = await pageDB.findByIdAndUpdate({ _id: deletedPost.pageId }, {
                $pull: { posts: deletedPost._id }
            })
            response.successResponse(res, deletedPost, 'Successfully deleted the post');
        }
        else {
            response.internalServerError(res, "Failed to delete the image");
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the post');
    }
})
//get all posts according to user intrest
const getAllPosts = asynchandler(async (req, res) => {
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, "Cannot fetch post without the user id");
    }
    const findUser = await userDB.findById({ _id: userId });
    console.log(findUser.pages)
    if (findUser) {
        const allPosts = await postDB.find({
            pageId: { $in: findUser.pages }
        });
        if (allPosts) {
            response.successResponse(res, allPosts, 'Successfully fetched the posts');
        }
        else {
            response.internalServerError(res, "Cannot get the posts");
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the user');
    }
})
//get a post
const getAPost = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        response.validationError(res, 'Cannot get the post without its id');
        return;
    }
    const findPost = await postDB.findById({ _id: id }).populate("pageId").populate({path:"comments.userId",select:"name"}).populate({
        path:"reaction",
        select:"name"
    });
    if (findPost) {
        response.successResponse(res, findPost, 'Successfully fetched the posts');
    }
    else {
        response.notFoundError(res, 'Cannot find the post');
    }
})

//create comment
const postComment = asynchandler(async (req, res) => {
    const { comment } = req.body;
    const userId = req.user._id;
    const postId = req.params.postId;
    if (!userId || !comment || !postId) {
        return response.validationError(res, 'Cannot post a comment without the details');
    }
    const newPost = {
        userId: userId,
        comment: comment
    }
    const findPost = await postDB.findById({ _id: postId }).populate('reaction').populate("pageId").populate("comments").populate("sharedBy");
    if (findPost) {
        // const updatePost = await postDB.findByIdAndUpdate({ _id: postId }, {
        //     $push: { comments: newPost }
        // });
        const newArray = [...findPost.comments, newPost];
        findPost.comments = newArray;
        await findPost.save();
        response.successResponse(res, findPost, 'Successfully poosted the comment')
    }
    else {
        response.notFoundError(res, 'Cannot found the post to post comment');
    }

})
//delete comment
const deleteComment = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const { commentId } = req.body;
    if (!postId || !commentId) {
        return response.validationError(res, 'Cannot delete comment without its id');
    }
    const findPost = await postDB.findById({ _id: postId }).populate('reaction').populate("pageId").populate("comments").populate("sharedBy");
    if (findPost) {
        const index = findPost.comments.findIndex((obj) => obj._id == commentId);
        findPost.comments.splice(index, 1);
        await findPost.save();
        response.successResponse(res, findPost, "Successfully deleted  the comment");
    }
    else {
        response.notFoundError(res, 'Cannot find the  comments');
    }
})
//edit comment
const editComment = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const { comment, commentId } = req.body;
    if (!postId || !comment || !commentId) {
        return response.validationError(res, 'Cannot update comment');
    }
    const findPost = await postDB.findById({ _id: postId }).populate('reaction').populate("pageId").populate("comments").populate("sharedBy");
    if (findPost) {
        const index = findPost.comments.findIndex((obj) => obj._id == commentId);
        findPost.comments[index].comment = comment;
        await findPost.save();
        response.successResponse(res, findPost, "Successfully edited the comment");
    }
    else {
        response.notFoundError(res, 'Cannot find the  comments');
    }
})
//update reaction3
const updateReactions = asynchandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    if (postId == ":postId" || !userId) {
        return response.validationError(res, "Cannot react without the post id or userId");
    }
    const findPost = await postDB.findById({ _id: postId }).populate('reaction').populate("pageId").populate("comments").populate("sharedBy")
    if (findPost) {
        const index = findPost.reaction.findIndex(obj => obj._id == userId)
        if (index > -1) {
            const index = findPost.reaction.indexOf(userId);
            findPost.reaction.splice(index, 1);
            await findPost.save();
            response.successResponse(res, findPost, 'Unreacted successfully');
        }
        else {
            findPost.reaction.push(userId);
            await findPost.save();
            response.successResponse(res, findPost, 'Reacted  successfully');
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the posts');
    }
})

//share  a post to a community






module.exports = { test, createPost, editComment, updatePost, deleteComment, deletePost, updateReactions, postComment, getAPost, getAllPosts };