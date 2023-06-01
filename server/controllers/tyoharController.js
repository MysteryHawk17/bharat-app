const tyoharDB = require("../models/tyoharModel");
const response = require('../middlewares/responsemiddleware');
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary")

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Successfully established the test tyohar routes');
})
const createTyohar = asynchandler(async (req, res) => {
    const { name, ytLink, text, date, popularityIndex } = req.body;
    if (!name || !ytLink || !text || !date || !popularityIndex || !req.file) {
        response.validationError(res, "Please fill in the details properly");
    }
    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const displayImage = uploadedData.secure_url;
    const monthsOfYear = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const index = parseInt(date.split('-')[1]);
    const reverseString = str => str.split('-').reverse().join('-');
    const dateObj = new Date(reverseString(date));
    const newTyohar = new tyoharDB({
        name: name,
        ytLink: ytLink,
        text: text,
        displayImage: displayImage,
        date: dateObj.toISOString(),
        month: monthsOfYear[index - 1],
        popularityIndex: popularityIndex ? popularityIndex : 0
    })

    const savedTyohar = await newTyohar.save();
    if (savedTyohar) {
        response.successResponse(res, savedTyohar, "successfully saved the tyohar");
    }
    else {
        response.internalServerError(res, "failed to saved the tyohar");
    }


})
const updateTyohar = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findTyohar = await tyoharDB.findById({ _id: id });
    if (findTyohar) {
        const { name, ytLink, text, date, popularityIndex } = req.body;
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
        if (date) {
            updateData.date = date;
            const monthsOfYear = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
            const index = parseInt(date.split('-')[1]);
            updateData.month = monthsOfYear[index - 1];
        }
        if (popularityIndex) {
            updateData.popularityIndex = popularityIndex;
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            })

            updateData.displayImage = uploadedData.secure_url;
        }
        const updatedTyohar = await tyoharDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedTyohar) {
            response.successResponse(res, updatedTyohar, "Successfully updated the tyohar");
        }
        else {
            response.internalServerError(res, "Cannot update the tyohar");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified tyohar");
    }

})

const deleteTyohar = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findTyohar = await tyoharDB.findById({ _id: id });
    if (findTyohar) {

        const deletedTyohar = await tyoharDB.findByIdAndDelete({ _id: id });
        if (deletedTyohar) {
            response.successResponse(res, deletedTyohar, "Successfully deleted the tyohar");
        }
        else {
            response.internalServerError(res, "Cannot delete the tyohar");
        }

    }
    else {
        response.notFoundError(res, "Cannot find the specified tyohar");
    }

})

const getByPopularity = asynchandler(async (req, res) => {
    const getAllTyohar = await tyoharDB.find({}).sort({ popularityIndex: -1 });
    if (getAllTyohar) {
        response.successResponse(res, getAllTyohar, "Successfullly fetched the tyohar by popularity");
    }
    else {
        response.internalServerError(res, "Failed to fetch the tyohar");
    }
})

const getATyohar = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!req.params.id) {
        response.validationError(res, 'Invalid parameter value');
        return;
    }
    const findTyohar = await tyoharDB.findById({ _id: id });
    if (findTyohar) {

        response.successResponse(res, findTyohar, "Successfully fetched the tyohar");

    }
    else {
        response.notFoundError(res, "Cannot find the specified tyohar");
    }
})

const getByMonth = asynchandler(async (req, res) => {
    const { month } = req.query;
    if (!month) {
        response.validationError(res, 'Invalid query parameter');
    }
    const getTyohars = await tyoharDB.find({ month: month });
    if (getTyohars) {
        response.successResponse(res, getTyohars, 'fetched the months tyohar successfully');
    }
    else {
        response.internalServerError(res, "Failed to fetched the tyohar by month");
    }

})
const upcomingTyohar = asynchandler(async (req, res) => {
    const getAllTyohar = await tyoharDB.find({}).sort({ date: -1 });
    if (getAllTyohar) {
        response.successResponse(res, getAllTyohar, "Successfullly fetched the tyohar by upcoming date");
    }
    else {
        response.internalServerError(res, "Failed to fetch the tyohar");
    }
})

module.exports = { test, createTyohar, deleteTyohar, updateTyohar, getATyohar, getByMonth, getByPopularity, upcomingTyohar };