const mongoose = require("mongoose");

//Physicist Model
const userSchema = new mongoose.Schema({
    userid:{
        type: String,
        trim: true,
        required: true,
    },
    fname:{
        type: String,
        trim: true,
        required: true,
        minlength:4
        
    },
    lname:{
        type: String,
        trim: true,
        required: true,
        minlength:4 
    },
    nic:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        maxlength:12,
        minlength:10,
        unique: true
    },
    email:{
      type: String,
      unique:true,
      trim: true,
      required: true,
      lowercase: true
    },
    mobile:{
        type: String,
        trim: true,
        required: true,
    },
    address:{
        type: String,
      trim: true,
      required: true,
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    usertype:{
        type:String
    },
    status:{
        type:String
    }
});


module.exports = User = mongoose.model("User",userSchema);