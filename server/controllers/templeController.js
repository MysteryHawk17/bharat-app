const templeDB = require("../models/templeModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");
const test = async (req, res) => {

    response.successResponse(res, '', 'Temple route established');
}
const createTemple = asynchandler(async (req, res) => {
    console.log(req.body);
    const { name, getPrasad } = req.body;
    if (!name || !getPrasad || !req.file) {
        response.validationError(res, 'Fill in all the fields');
        return;
    }
    var imageURL = '';
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    imageURL = uploadedData.secure_url;
    const newTemple = templeDB({
        name: name,
        image: imageURL,
        getPrasad: getPrasad
    });
    const savedData = await newTemple.save();
    if (savedData) {
        response.successResponse(res, savedData, "Saved the temple successfully");
    }
    else {
        response.internalServerError(res, "Failed to save the temple");
    }
})

const updateTemple = asynchandler(async (req, res) => {
    const { name } = req.body;
    const id = req.params.id;
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {
        const updateData = {};
        if (name) {
            updateData.name = name;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            })
            updateData.image = uploadedData.secure_url;
        }
        const updatedData = await templeDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedData) {
            response.successResponse(res, updatedData, 'Successfully updated temple');
        }
        else {
            response.internalServerError(res, "Failed to update temple");
        }
    }
    else {
        response.notFoundError(res, "Failed to find the specified temple");
    }

})
const deleteTemple = asynchandler(async (req, res) => {

    const id = req.params.id;
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {

        const deletedData = await templeDB.findByIdAndDelete({ _id: id });
        if (deletedData) {
            response.successResponse(res, deletedData, 'Successfully deleted temple');
        }
        else {
            response.internalServerError(res, "Failed to delete temple");
        }
    }
    else {
        response.notFoundError(res, "Failed to find the specified temple");
    }

})
const getAllTemple = asynchandler(async (req, res) => {
    const allTemples = await templeDB.find({});
    if (allTemples) {
        response.successResponse(res, allTemples, "Successfully fetched all the temples");
    }
    else {
        response.internalServerError(res, "Cannot fetch all the temples");
    }
})


const getATemple = asynchandler(async (req, res) => {
    const id = req.params.id;
    const findTemple = await templeDB.findById({ _id: id });
    if (findTemple) {

        response.successResponse(res, findTemple, "Successfully fetched the temple");
    }
    else {
        response.notFoundError(res, "Failed to find the specified temple");
    }
})
module.exports = { test, createTemple, updateTemple, deleteTemple, getAllTemple ,getATemple};