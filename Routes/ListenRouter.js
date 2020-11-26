const lrouter = require("express").Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Listen = require('../Models/ListenModel');
// const upload = multer({dest:'uploads/'})

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
 



// const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
  
  const upload = multer({
    storage: storage,
    // fileFilter: fileFilter
  });



  lrouter.post("/addaudio/", upload.single('myImage'), (req, res, next) => {
  console.log(req.file);
    const product = new Listen({
      ndate: req.body.ndate,
      title: req.body.title,
      transcript: req.body.transcript,
      myImage: req.file.path.replace(/\\/g, "/")
    }); 
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              ndate: result.ndate,
              title: result.title,
              transcript:result.transcript
            //   productImage:result.path
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  



  module.exports = lrouter;