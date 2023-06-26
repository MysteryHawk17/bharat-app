const deityDB = require("../models/deityModel")
const songDB = require("../models/songsModel");
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Songs route established");
})
const uploadSong = asynchandler(async (req, res) => {
    console.log(req.body);
    const { deityId, songType, name } = req.body;
    if (!deityId || !songType || !req.file || !name) {
        return response.validationError(res, 'Cannot upload a song without proper info');
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
        public_id: req.file.originalname
    })
    const duration = `${parseInt(uploadedData.duration / 60)}:${parseInt(uploadedData.duration % 60)}s`
    const newSong = new songDB({
        deityId: deityId,
        songType: songType,
        name: name,
        audioUrl: uploadedData.secure_url,
        duration: duration
    })
    const savedSong = await newSong.save();
    if (savedSong) {
        const updateDeity = await deityDB.findByIdAndUpdate({ _id: deityId }, {
            $push: { songs: savedSong._id }
        })
        if (updateDeity) {

            response.successResponse(res, savedSong, 'Saved song successfully');
        }
        else {
            response.errorResponse(res, 'Saved song successfully but cannot add to deity', 400);

        }
    }
    else {
        response.internalServerError(res, "Cannot save the song");
    }

})
const updateSong = asynchandler(async (req, res) => {
    const songId = req.params.id;
    if (songId == ":id") {
        response.validationError(res, "Cannot update the song if song id is not given");
        return;
    }
    const findSong = await songDB.findById({ _id: songId });
    if (!findSong) {
        return response.notFoundError(res, "Cannot find the song");
    }
    const { name, songType } = req.body;
    const updateData = {};
    if (name) {
        updateData.name = name;
    }
    if (songType) {
        updateData.songType = songType;
    }
    if (req.file) {
        const deleteFromClound = await cloudinary.uploader.destroy(findSong.audioUrl);
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            public_id: req.file.originalname
        })
        const duration = `${parseInt(uploadedData.duration / 60)}:${parseInt(uploadedData.duration % 60)}s`
        updateData.audioUrl = uploadedData.secure_url;
        updateData.duration = duration;

    }
    const updatedSong = await songDB.findByIdAndUpdate({ _id: songId }, updateData, { new: true });
    if (updatedSong) {
        response.successResponse(res, updatedSong, 'Successfully updated the song');
    }
    else {
        response.internalServerError(res, 'Cannot update the song');
    }


})
const deleteSong = asynchandler(async (req, res) => {
    const songId = req.params.id;
    if (songId == ":id") {
        response.validationError(res, "Cannot delete the song if song id is not given");
        return;
    }
    const findSong = await songDB.findById({ _id: songId });
    if (!findSong) {
        return response.notFoundError(res, "Cannot find the song");
    }
    const deleteFromCloud = await cloudinary.uploader.destroy(findSong.audioUrl);
    const deletedSong = await songDB.findByIdAndDelete({ _id: songId });
    if (deletedSong) {
        const findDeity = await deityDB.findById({ _id: findSong.deityId });
        if (!findDeity) {
            response.notFoundError(res, "Successfully deleted the song and cannnot find the deity");
            return;
        }
        const findIndex = findDeity.songs.indexOf(deletedSong._id);
        console.log(findIndex);
        if (findIndex > -1) {
            findDeity.songs.splice(findIndex, 1);

        }
        await findDeity.save();

        response.successResponse(res, deletedSong, 'Successfully deleted the song and updated the deity');
    }
    else {
        response.internalServerError(res, "Failed to delete the song");
    }

})
const getAllSongs = asynchandler(async (req, res) => {
    const { deityId, songType } = req.query;

    // const songType = req.query;
    const queryObj = {};
    if (songType) {
        queryObj.songType = songType;
    }
    if (deityId) {
        queryObj.deityId = deityId;

    }
    // if (deityId == ":deityId") {
    //     return response.validationError(res, 'Cannot find the song without the deity');
    // }
    const findSongs = await songDB.find(queryObj);
    if (findSongs) {
        response.successResponse(res, findSongs, "Successfully fetched all the songs");
    }
    else {
        response.internalServerError(res, "Failed to fetch all the songs");
    }



})

const getASong = asynchandler(async (req, res) => {
    const songId = req.params.id;
    if (songId == ":id") {
        return response.validationError(res, "Cannot find the song without the id");
    }
    const findSong = await songDB.findById({ _id: songId });
    if (findSong) {
        response.successResponse(res, findSong, 'Successfully fetched the songs')
    }
    else {
        response.notFoundError(res, 'Failed to find the song');

    }
})

module.exports = { test, uploadSong, getASong, getAllSongs, updateSong, deleteSong };