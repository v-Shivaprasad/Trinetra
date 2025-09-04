const router = require("./auth-controller");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {  Admemail, Admpass, YOUR_EMAIL ,key} = require('../config/constants');
const {User} = require("../models/models")

let otpDict={},AdminStore={};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: YOUR_EMAIL, 
    pass: key, 
  },
});

function getRandom5DigitInt() {
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


router.post('/AdminT1',async (req,res) =>{
  try {
    if (req.body.Admemail === Admemail && req.body.Admpassword === Admpass) {
      
      const random5DigitNum = getRandom5DigitInt();
      // Email options
      const mailOptions = {
        from: YOUR_EMAIL,
        to: Admemail, 
        subject: 'Admin Validation',
        text: random5DigitNum.toString(), 
      };
      
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error:', error.message);
        } else {
          console.log('Email sent:', info.response);
        }
      });

     const otp = random5DigitNum.toString();
     console.log(otp);
     bcrypt.hash(otp, 10, function(err, hash) {
      if (err) {
        console.error('Error hashing OTP:', err);
        res.status(500).json({ ok: false, error: 'Internal Server Error' });
      } else {
        console.log('Hashed OTP:', hash);
        res
        .status(201)
        .json({ ok: true});
        if(!AdminStore[Admemail])
        AdminStore[Admemail] = hash
      }
    });
  }

    else{
      res.status(400).json({ ok: false, error: 'Invalid email' });
    }
  
   }catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
})

router.get('/AdminT2',async(req,res) =>{
  try {
    let rece = req.query.OTP;
    const match = await bcrypt.compare(rece, Admintoken);
  if (match) {
    res.status(200).json({ ok: true , Atoken:Admintoken });
    delete AdminStore[Admemail]
  } else {
    res.status(400).json({ ok: false, error: 'Invalid Otp' });
  }
}
catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
})


// SIGN UP
router.get("/users/initiateReg",async (req,res) =>{
  try {
    const email = req.query.email;
    const genOtp = getRandom5DigitInt();
    const mailOptions = {
    from: YOUR_EMAIL, 
    to: email, 
    subject: 'Client Validation',
    text: genOtp.toString(),
      };

     transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
      console.error('Error:', error.message);
      res.status(500).json({ok:false,error:error})
    } else {
      console.log('Email sent:', info.response);
      // RegOtp = genOtp;
      otpDict[email] = genOtp;
      res.status(201).json({ ok: true });
    }

  }); 

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/users/validateOtp', async (req, res) => {
  try {
    console.log(req.body);
    const enteredOtp = Number(req.body.otp);
    const userEmail = req.body.email;

    if (!enteredOtp || !userEmail) {
      return res.status(400).json({ error: 'Missing OTP or email in request body' });
    }

    if (enteredOtp === otpDict[userEmail]) {
      delete otpDict[userEmail]; 
      return res.status(201).json({ ok: true });
    } else {
      return res.status(400).json({ ok: false, error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/users/check-email', async (req, res) => {
  try {
    const userExist = await User.findOne({ signemail: req.query.email });

    if (userExist) {
      return res.status(400).json({ msg: 'Email already exists' , ok:false });
    }
    return res.status(200).json({ msg: 'Email is available', ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.signpassword, 10);

    const user = new User({
      name: req.body.name,
      signemail: req.body.signemail,
      profession: req.body.profession,
      institution: req.body.institution,
      signpassword: hashedPassword,
    });
   console.log(user);
    const resu = await user.save();
    res.status(201).json({result: resu,ok:true});
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      res.status(400).json({ error: 'Email already exists.' ,ok:false});
    } else {
      console.log(error);
      res.status(500).json({ error: 'Internal server error',ok:false });
    }
  }
});

// Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ signemail: req.body.logemail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(req.body.logpassword, user.signpassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const cToken = await user.generateToken();;
    res
    .status(201)
    .json({msg: 'Login Succesful',token:cToken})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;