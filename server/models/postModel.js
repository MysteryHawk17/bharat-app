const mongoose = require("mongoose");


const postSchema = mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reaction: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            required: true
        }
    }],
    shared: {
        type: Boolean,
        required: true,
        default: false
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;