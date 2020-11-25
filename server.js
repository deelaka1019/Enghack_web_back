const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//set up express
const app = express();
app.use(express.json());
app.use(cors()); 

//set up port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started ${PORT}`));


//set up mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
},(err) => {
    if(err) throw err;
    console.log("Mongodb atlas connected");

});


//set up routes


app.use("/user",require("./Routes/UserRouter"));
