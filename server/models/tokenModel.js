const mongoose = require("mongoose");


const tokenSchema = mongoose.Schema({
    phone: {
        type:Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{ timestamps: true })
const tokenModel = mongoose.model("Token", tokenSchema);

module.exports = tokenModel;