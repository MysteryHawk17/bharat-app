const deityDB = require("../models/deityModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");
const { getAccessToken, getPlaylistTracks } = require("../utils//spotifyIntegrate");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Deity Route Established');
})

const createDeity = asynchandler(async (req, res) => {
    const { name, temple, playlistURL } = req.body;
    if (!name || !temple || !playlistURL || !req.files) {
        response.validationError(res, "Fill in all the fields");
        return;
    }

    const uploadedData1 = await cloudinary.uploader.upload(req.files[0].path, {
        folder: "Bharat One"
    });
    const uploadedData2 = await cloudinary.uploader.upload(req.files[1].path, {
        folder: "Bharat One"
    });

    const templeArray = temple.split(",");

    const newDeity = new deityDB({
        name: name,
        temple: templeArray,
        playlistURL: playlistURL,
        flowers: uploadedData2.secure_url,
        image: uploadedData1.secure_url
    })
    const savedDeity = await newDeity.save()


    if (savedDeity) {
        response.successResponse(res, savedDeity, "Successfully saved the deity");

    }
    else {
        response.internalServerError(res, "Error in saving user");
    }

})
const getAllDiety = asynchandler(async (req, res) => {
    const deity = await deityDB.find().populate("temple");
    if (deity) {
        response.successResponse(res, deity, "Successfully fetched all the deity");
    }
    else {
        response.internalServerError(res, "Error in fetching the deity");
    }
})

const getOneDeity = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (id) {
        const findDeity = await deityDB.findById({ _id: id }).populate("temple");
        if (findDeity) {
            response.successResponse(res, findDeity, "Successfully fetched the deity");
        }
        else {
            response.notFoundError(res, "Error in finding the deity");
        }
    }
    else {
        response.validationError(res, "Give in the proper details")
    }
})

const updateDeity = asynchandler(async (req, res) => {
    const { id } = req.params;
    const findDeity = await deityDB.findById({ _id: id });
    if (findDeity) {
        const { name, song, flowers, temple } = req.body;
        const updateData = {};
        if (name) {
            updateData.name = name;
        }
        if (playlistURL) {
            updateData.playlistURL = playlistURL;

        }

        if (req.files) {
            const uploadedData = await cloudinary.uploader.upload(req.files[0].path, {
                folder: "Bharat One"
            });
            updateData.image = uploadedData.secure_url;
        }
        if (req.files.length > 1) {
            const uploadedData = await cloudinary.uploader.upload(req.files[1].path, {
                folder: "Bharat One"
            });
            updateData.flowers = uploadedData.secure_url;
        }
        if (temple) {
            const templeArray = findDeity.temple;
            templeArray.push(temple);
            updateData.temple = temple;
        }
        const updatedData = await deityDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedData) {
            response.successResponse(res, updatedData, 'Successfully updated the deity');
        }
        else {
            response.internalServerError(res, "Failed to update the deity");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the deity");
    }
})

const deleteDeity = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (id) {
        const findDeity = await deityDB.findById({ _id: id });
        if (findDeity) {
            const deletedDeity = await deityDB.findByIdAndDelete({ _id: id });
            if (deletedDeity) {
                response.successResponse(res, deletedDeity, "Deleted the deity successfully");

            }
            else {
                response.internalServerError(res, "Error in deleting the deity");
            }
        }
        else {
            response.notFoundError(res, "Not found the deity");
        }
    }
    else {
        response.validationError(res, "Give in proper details");
    }
})

const getAllSongs = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, 'Please fill in the parameters');
        return;
    }
    const findDeity = await deityDB.findById({ _id: id });
    if (findDeity) {
        const playlist = findDeity.playlistURL;
        const playlistId = playlist.split("/")[4];
        const accessToken = await getAccessToken();
        const getAllTracks = await getPlaylistTracks(accessToken, playlistId);
        if (getAllTracks) {

            response.successResponse(res, getAllTracks, "Successfully fetched the tracks");
        }
        else {
            response.internalServerError(res, "Error in fetching the tracks.");
        }


    }
    else {
        response.notFoundError(res, "Cannot found the deity");
    }



})

module.exports = { test, createDeity, getAllDiety, getOneDeity, updateDeity, deleteDeity, getAllSongs };