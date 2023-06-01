const literatureDB = require("../models/literatureModel");
const asynchandler = require("express-async-handler");
const response = require('../middlewares/responsemiddleware')

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Literature test route established');

})

const createLiterature = asynchandler(async (req, res) => {
    const { name, text } = req.body;
    if (!name || !text) {
        response.validationError(res, 'Properly fill the required fields');
        return;
    }
    const newLiterature = new literatureDB({
        name: name,
        text: text
    })
    const savedLiterature = await newLiterature.save();
    if (savedLiterature) {
        response.successResponse(res, savedLiterature, 'Saved literature successfully');
    }
    else {
        response.internalServerError(res, 'Error in saving the literature');
    }

})


const getAllLiterature = asynchandler(async (req, res) => {
    const getLiteratures = await literatureDB.find();
    if (getLiteratures) {
        response.successResponse(res, getLiteratures, "Successfully fetched literatures");
    }
    else {
        response.internalServerError(res, "Failed to fetch all the literatures");
    }
})

const getALiteratrue = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findLiterature = await literatureDB.findById({ _id: id });
    if (findLiterature) {
        response.successResponse(res, findLiterature, 'Successfully fetched the literature');

    }
    else {
        response.notFoundError(res, "Cannot find the specified literature");
    }

})

const updateLiterature = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findLiterature = await literatureDB.findById({ _id: id });
    if (findLiterature) {
        const { name, text } = req.body;
        const updateData = {};
        if (name) {
            updateData.name = name;

        }
        if (text) {
            updateData.text = text;
        }
        const updatedLiterature = await literatureDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedLiterature) {
            response.successResponse(res, updatedLiterature, "Successfully updated the literature");
        }
        else {
            response.internalServerError(res, "Cannot update the literature");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified literature");
    }

})

const deleteLiterature = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findLiterature = await literatureDB.findById({ _id: id });
    if (findLiterature) {

        const deletedLiterature = await literatureDB.findByIdAndDelete({ _id: id });
        if (deletedLiterature) {
            response.successResponse(res, deletedLiterature, "Successfully deleted the literature");
        }
        else {
            response.internalServerError(res, "Cannot delete the literature");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified literature");
    }

})
module.exports = { test, createLiterature, getALiteratrue, getAllLiterature, deleteLiterature, updateLiterature };