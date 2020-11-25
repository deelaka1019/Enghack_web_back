const rrouter = require("express").Router();
const Reading = require("../Models/ReadModel");

rrouter.post("/addreading", async (req, res) => {
    let {ndate,title,description} = req.body;
    
    try {
      //validate
      if (!ndate || !title || !description) {
        return res.status(400).json({ msg: "Please fill the all fields" });
      }


      const newRead = new Reading({
        ndate,
        title,
        description
      });
    
    
    const savedRead = await newRead.save();
    res.json({
        savedRead
    });



    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });



    rrouter.route('/loadreadings').get((req,res) => {
        Reading.find()
        .then(emp => res.json(emp))
        .catch(err => res.status(400).json('Error: '+err))
      });

    module.exports = rrouter;
    