const mongoose = require("mongoose");

//Listening Model
const listenSchema = new mongoose.Schema({
    ndate:{
        type:String,
        required:true
    },
    title:{
        type: String,
        required: true,
    },
    productImage:{
        type:String,
    }
})

module.exports = Listen = mongoose.model("Listen",listenSchema);