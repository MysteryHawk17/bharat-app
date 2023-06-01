const mongoose=require("mongoose")

const templeSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    getPrasad:{
        type:String,
        required:true
    }

},{timestamps:true})

const templeModel=mongoose.model("Temple",templeSchema)
module.exports=templeModel;