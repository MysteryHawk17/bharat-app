const mongoose=require("mongoose")
require("dotenv").config();

const connectDB=(uri)=>{
    mongoose.connect(uri).then(()=>{
        console.log("Connected to mongodb successfully")
    }).catch((e)=>{
        console.log("Error in connecting to mongodb");
        console.log(e);
    })
}

module.exports=connectDB;