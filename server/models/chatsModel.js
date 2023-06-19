const mongoose = require("mongoose");


const chatsSchema = mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    chat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
}, { timestamps: true })


const chatsModel = mongoose.model("Chat", chatsSchema);
module.exports=chatsModel