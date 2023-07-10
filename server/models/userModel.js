const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page"
    }],
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    language: {
        type: String,

    }
}, { timestamps: true })

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;