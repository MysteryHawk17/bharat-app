const mongoose=require("mongoose");


const mandirSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    displayImage:{
        type:String
    },
    ytLink:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    deityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Aradhya"
    }
},{timestamps:true})

const mandirModel=mongoose.model("Mandir",mandirSchema);
module.exports=mandirModel;