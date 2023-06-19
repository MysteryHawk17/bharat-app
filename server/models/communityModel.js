const mongoose = require("mongoose")


const communitySchema = mongoose.Schema({
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
    deityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Deity"
    }

},{ timestamps: true })

const communityModel = mongoose.model("Community", communitySchema);

module.exports = communityModel;