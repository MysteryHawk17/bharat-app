const mongoose=require("mongoose");

const tyoharSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    ytLink:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    displayImage:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    month:{
        type:String
    },
    popularityIndex:{
        type:Number,
        required:true
    }
},{timestamps:true})


const tyoharModel=mongoose.model("Tyohar",tyoharSchema);
module.exports=tyoharModel;