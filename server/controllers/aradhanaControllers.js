const aradhayaDB = require("../models/aradhyaModel");
const mandirDB = require("../models/mandirModel");
const asynchandler = require("express-async-handler");
const response = require("../middlewares/responsemiddleware");
const cloudinary = require("../utils/cloudinary");
const { getAccessToken, getPlaylistTracks } = require("../utils//spotifyIntegrate");


const test = asynchandler(async (req, res) => [
    response.successResponse(res, '', 'Successfully established the aradhana routes')
])

const createAradhaya = asynchandler(async (req, res) => {
    const { name, index, ytLink, literature, mandir, audioLink } = req.body;
    if (!name || !index || !req.file) {
        response.validationError(res, 'Please fill in the details');
        return;
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    const displayImage = uploadedData.secure_url;
    const newAradhaya = new aradhayaDB({
        name: name,
        displayImage: displayImage,
        ytLink: ytLink.split(","),
        audioLink: audioLink,
        literature: literature.split(","),
        mandir: mandir.split(",")
    })
    const savedAradhana = await newAradhaya.save();
    if (savedAradhana) {
        response.successResponse(res, savedAradhana, "Successfully saved the aradhaya");
    }
    else {
        response.internalServerError(res, 'Error in saving the aradhaya');
    }

})
const deleteAradhaya = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findAradhana = await aradhayaDB.findById({ _id: id });
    if (findAradhana) {

        const deletedAradhaya = await mandirDB.findByIdAndDelete({ _id: id });
        if (deletedAradhaya) {
            response.successResponse(res, deletedAradhaya, "Successfully deleted the aradhaya");
        }
        else {
            response.internalServerError(res, "Cannot delete the aradhaya");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified aradhaya");
    }
})
const updateAradhaya = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findAradhana = await aradhayaDB.findById({ _id: id });
    if (findAradhana) {
        const { name, index, ytLink, literature, mandir, audioLink } = req.body;
        const updateData = {};
        if (name) {
            updateData.name = name;
        }
        if (index) {
            updateData.index = index;
        }
        if (audioLink) {
            updateData.audioLink = audioLink;
        }
        if (ytLink) {
            updateData.ytLink = ytLink.split(",");
        }
        if (literature) {
            updateData.literature = literature.split(",");
        }
        if (mandir) {
            updateData.mandir = mandir.split(",");
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            })
            updateData.displayImage = uploadedData.secure_url;
        }
        const updatedAradhaya = await aradhayaDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedAradhaya) {
            const mandirArray = updatedAradhaya.mandir;
            mandirArray.map(async (e) => {
                const updatedMandir = await mandirDB.findByIdAndUpdate({ _id: id }, {
                    deityId: updatedAradhaya._id
                }, { new: true });
            })
            response.successResponse(res, updatedAradhaya, "Successfully updated the aradhaya");
        }
        else {
            response.internalServerError(res, 'Error in updating aradhaya');
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified aradhaya");
    }
})
const getAllAradhaya = asynchandler(async (req, res) => {
    const allAradaya = await aradhayaDB.find({}).populate('mandir').populate('literature').sort({ index: -1 });
    if (allAradaya) {
        response.successResponse(res, allAradaya, "Successfully fetched all the aradhaya");
    }
    else {
        response.internalServerError(res, 'Failed to fetch all the aradhaya');
    }
})
const getAAradhaya = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findAradhaya = await aradhayaDB.findById({ _id: id }).populate('mandir').populate('literature');
    if (findAradhaya) {
        response.successResponse(res, findAradhaya, 'Successfully fetched the aradhaya');

    }
    else {
        response.notFoundError(res, "Cannot find the specified aradhaya");
    }
})

const getSongs = asynchandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        response.validationError(res, 'Please fill in the parameters properly');
        return
    }
    const findAradhana = await aradhayaDB.findById({ _id: id });
    if (findAradhana) {
        const playlist = findAradhana.audioLink;
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
        response.internalServerError(res, "Error in finding the specified aradhaya");
    }

})

module.exports = { test,createAradhaya,getAllAradhaya,getAAradhaya,getSongs,updateAradhaya,deleteAradhaya }
