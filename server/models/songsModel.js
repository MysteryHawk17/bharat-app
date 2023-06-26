const mongoose = require("mongoose");


const songSchema = mongoose.Schema({
    deityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deity"
    },
    songType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
}, { timestamps: true });


const songModel = mongoose.model("Song", songSchema);
module.exports = songModel;