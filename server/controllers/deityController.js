const deityDB = require("../models/deityModel")
const response = require("../middlewares/responsemiddleware");
const asynchandler = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");

const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Deity Route Established');
})

const createDeity = asynchandler(async (req, res) => {
    const { name, temple, song, flowers } = req.body;
    if (!name || !temple || !song || !flowers) {
        response.validationError(res, "Fill in all the fields");
        return;
    }
    var image='';
    if(req.file){
        const uploadedData=await cloudinary.uploader.upload(req.file.path,{
            folder:"Bharat One"
        });
        image=uploadedData.secure_url;
    }
    const templeArray=temple.split(",");

    const newDeity = new deityDB({
        name: name,
        temple: templeArray,
        song: song,
        flowers: flowers,
        image:image
    })
    const savedDeity = await newDeity.save().populate("temple");


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
        if (song) {
            updateData.song = song;

        }
        if (flowers) {
            updateData.flowers = flowers
        }
        if (req.file) {
            const uploadedData = await cloudinary.uploader.upload(req.file.path, {
                folder: "Bharat One"
            });
            updateData.image = uploadedData.secure_url;
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

const deleteDeity=asynchandler(async(req,res)=>{
    const id=req.params;
    if(id){
        const findDeity=await deityDB.findById({_id:id});
        if(findDeity){
            const deletedDeity=await findDeity.findByIdAndDelete({_id:id});
            if(deletedDeity){
                response.successResponse(res,deletedDeity,"Deleted the deity successfully");

            }
            else{
                response.internalServerError(res,"Error in deleting the deity");
            }
        }
        else{
            response.notFoundError(res,"Not found the deity");
        }
    }
    else{
        response.validationError(res,"Give in proper details");
    }
})
module.exports = { test ,createDeity,getAllDiety,getOneDeity,updateDeity,deleteDeity};