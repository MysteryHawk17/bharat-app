const mongoose = require("mongoose");


const communitySchema = mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    // chat: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Message"
    // }]
    data: [
        {
            chat: {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Message"
            },
            post:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post"        
            }
        }]
}, { timestamps: true })


const communityModel = mongoose.model("Community", communitySchema);
module.exports = communityModel