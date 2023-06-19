const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    isUpdated:{
        type:String,
        required:true,
        default:false
    }

}, { timestamps: true })


const messageModel=mongoose.model("Message",messageSchema);


module.exports=messageModel