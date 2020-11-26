const mongoose = require("mongoose");

//Listening Model
const listenSchema = new mongoose.Schema({
    ndate:{
        type:String,
  
    },
    title:{
        type: String,
    
    },
    transcript:{
        type:String
    },
    myImage:{
        type:String,
    }
})

module.exports = Listen = mongoose.model("Listen",listenSchema);