const mongoose = require("mongoose")

const aradhyaSchmea = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    displayImage: {
        type: String,
        required: true
    },
    ytLink: [String],
    audioLink: {
        type: String,
    },
    literature: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Literature"
    }],
    mandir: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mandir"
    }],
    index:{
        type:Number,

    }
},{timestamps:true})

const aradhyaModel = mongoose.model("Aradhya", aradhyaSchmea);
module.exports = aradhyaModel;