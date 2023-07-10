const mongoose = require("mongoose")


const pageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    displayImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],

},{ timestamps: true })

const pageModel = mongoose.model("Page", pageSchema);

module.exports = pageModel;