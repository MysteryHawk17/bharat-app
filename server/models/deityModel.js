const mongoose=require("mongoose")


const deitySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    temple:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Temple"
        }
    ],
    playlistURL:{
        type:String,
        required:true
    },
    flowers:{
        type:String,
        required:true
    }

},{timestamps:true});

const deityModel=mongoose.model("Deity",deitySchema);
module.exports=deityModel;