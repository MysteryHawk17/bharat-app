const mongoose = require("mongoose");


const communitySchema = mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    chat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
}, { timestamps: true })


const communityModel = mongoose.model("Community", communitySchema);
module.exports=communityModel