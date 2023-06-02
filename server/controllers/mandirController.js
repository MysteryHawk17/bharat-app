const mandirDB = require("../models/mandirModel");
const response = require("../middlewares/responsemiddleware");
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Mandir routes established');
})

const createMandir = asynchandler(async (req, res) => {
    const { name, link, text } = req.body;
    if (!name || !link || !text || !req.file) {
        response.validationError(res, "Fill in the fields properly");
        return;
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    });
    const newMandir = new mandirDB({
        name: name,
        displayImage: uploadedData.secure_url,
        ytLink: link,
        text: text,
        // deityId:{}
    })
    const savedMandir = await newMandir.save();
    if (savedMandir) {
        response.successResponse(res, savedMandir, "Saved the mandir successfully");
    }
    else {
        response.internalServerError(res, "Error in saving the mandir");
    }

})

const getAllMandir = asynchandler(async (req, res) => {
    const getMandirs = await mandirDB.find();
    if (getMandirs) {
        response.successResponse(res, getMandirs, "Successfully fetched Mandirs");
    }
    else {
        response.internalServerError(res, "Failed to fetch all the Mandirs");
    }
})

const getAMandir = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findMandir = await mandirDB.findById({ _id: id });
    if (findMandir) {
        response.successResponse(res, findMandir, 'Successfully fetched the mandir');

    }
    else {
        response.notFoundError(res, "Cannot find the specified mandir");
    }

})

const updateMandir = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findMandir = await mandirDB.findById({ _id: id });
    if (findMandir) {
        const { name, text, ytLink } = req.body;
        const updateData = {};
        if (name) {
            updateData.name = name;

        }
        if (text) {
            updateData.text = text;
        }
        if (ytLink) {
            updateData.ytLink = ytLink;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            })

            updateData.displayImage = uploadedData.secure_url;
        }
        const updatedMandir = await mandirDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedMandir) {
            response.successResponse(res, updatedMandir, "Successfully updated the mandir");
        }
        else {
            response.internalServerError(res, "Cannot update the mandir");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified mandir");
    }

})

const deleteMandir = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findMandir = await mandirDB.findById({ _id: id });
    if (findMandir) {

        const deletedMandir = await mandirDB.findByIdAndDelete({ _id: id });
        if (deletedMandir) {
            response.successResponse(res, deletedMandir, "Successfully deleted the mandir");
        }
        else {
            response.internalServerError(res, "Cannot delete the mandir");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified mandir");
    }

})

module.exports = { test, createMandir, getAllMandir, getAMandir, deleteMandir, updateMandir };