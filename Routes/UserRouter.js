const erouter = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");
//Employee(admin,clerk,physycist) registration

erouter.post("/registeruser", async (req, res) => {
  let { userid,fname, lname,nic,email,mobile,address,password,passwordCheck,usertype} = req.body;
  
  try {
    //validate
    if (!userid || !fname || !lname || !nic || !email || !mobile || !address || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please fill the all fields" });
    }

    if (fname.length < 4) {
      return res.status(400).json({ msg: "First name is too short" });
    }
    if (lname.length < 4) {
      return res.status(400).json({ msg: "Last name is too short" });
    }


    

    const existinguserid = await User.findOne({ userid: userid });
    if (existinguserid) {
      return res.status(400).json({ msg: "This index no is already taken" });
    }

    const existingNic = await User.findOne({ nic: nic });
    if (existingNic) {
      return res.status(400).json({ msg: "The NIC is already taken" });
    }

    const existingmobile = await User.findOne({ mobile: mobile });
    if (existingmobile) {
      return res.status(400).json({ msg: "The mobile number is already taken" });
    }


    const validmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!validmail.test(email)) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: "The email is already taken" });
    }
  
  

    const validnic = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (!validnic.test(nic)) {
      return res.status(400).json({ msg: "Invalid NIC" });
    }

   

   

    if (password.length < 5) {
      return res.status(400).json({ msg: "Password must be greater than 5" });
    }
    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "Two Passwords are not matched" });
    }


    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // console.log(passwordHash);

if(usertype === "admin"){
  const newAdmin = new User({
    userid,
    fname,
    lname,
    nic,
    email,
    mobile,
    address,
    password: passwordHash,
    usertype:"admin",
    status:"Authorized Admin"
  });
 

const savedAdmin= await newAdmin.save();
res.json({
    savedAdmin, 
});
}




if(usertype === "student"){
  const newStudent = new User({
    userid,
    fname,
    lname,
    nic,
    email,
    mobile,
    address,
    password: passwordHash,
    usertype:"student",
    status:"pending activation"
  });


const savedStudent = await newStudent.save();
res.json({
  savedStudent
});
}



  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});






erouter.post("/adminlogin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      //validate
      if (!email || !password) {
        return res.status(400).json({ msg: "Please fill the all fields" });
      }
  
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No acoount registerded for this email" });
      }

     
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Please Enter Correct Password" });
      }

      if(user.status !== "Authorized Admin" && user.usertype !== "admin"){
        return res.status(400).json({ msg: "Sorry!! you are not authorized admin" });
     }
     
  
      const token = jwt.sign({ id: user._id, email:user.email, usertype: user.usertype,status:user.status }, process.env.JWT_SECRET);
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          usertype: user.usertype,
          status:user.status
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  erouter.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
    //   console.log(verified);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  



  erouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      id: user._id,
      email: user.email,
      usertype: user.usertype,
      status:user.status
    });
  });



erouter.route('/loadusers').get((req,res) => {
  User.find()
  .then(emp => res.json(emp))
  .catch(err => res.status(400).json('Error: '+err))
});



erouter.route('/deleteadmin/:ademail').delete((req,res) => {


    try{
     
      User.countDocuments({usertype: 'admin'}, function(err, c) {
        if(c<=1){
          return res.status(400).json({ msg: "Sorry You can't delete this admin" });
        }else{
          User.findOneAndRemove({email:req.params.ademail})
            .then(() => res.json('Admin deleted'));  
        }
      })
   

    }catch(err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });
  
  




  erouter.route('/updatependingstu/:stuid').post((req,res) => {
    User.findOne({_id:req.params.stuid})
    .then(p => {
      p.status = req.body.status

      p.save()
      .then(() => res.json('Status updated'))
      .catch(err => res.status(400).json('Error: ' + err));
    })

    .catch(err => res.status(400).json('Error: ' + err));
  })
  

  erouter.route('/deletestu/:stuid').delete((req,res) => {

    try{
    
          User.findOneAndRemove({_id:req.params.stuid})
            .then(() => res.json('Student deleted'));
      
    }catch(err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });
  


module.exports = erouter;
