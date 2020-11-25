const mongoose = require("mongoose");

//Readings Model
const readSchema = new mongoose.Schema({
    ndate:{
        type:String,
        required:true
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true
    }
})

module.exports = Reading = mongoose.model("Reading",readSchema);