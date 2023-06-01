const mongoose=require("mongoose");


const literatureSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})


const literatureModel=mongoose.model('Literature',literatureSchema);

module.exports=literatureModel;
