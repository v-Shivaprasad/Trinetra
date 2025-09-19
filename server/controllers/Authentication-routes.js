const router = require("./auth-controller");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {  Admemail, Admpass, YOUR_EMAIL ,key, JWT_SECRET, JWT_REFRESH_SECRET} = require('../config/constants');
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
    //  console.log(otp);
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


// router.post('/users', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.signpassword, 10);

//     const user = new User({
//       name: req.body.name,
//       signemail: req.body.signemail,
//       profession: req.body.profession,
//       institution: req.body.institution,
//       signpassword: hashedPassword,
//     });
//    console.log(user);
//     const resu = await user.save();
//     res.status(201).json({result: resu,ok:true});
//   } catch (error) {
//     console.log(error);
//     if (error.code === 11000) {
//       res.status(400).json({ error: 'Email already exists.' ,ok:false});
//     } else {
//       console.log(error);
//       res.status(500).json({ error: 'Internal server error',ok:false });
//     }
//   }
// });



router.get('/users/me', async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log(`Cookies: ${req.cookies.accessToken}` );
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      console.log("it is not null")
      decoded = jwt.verify(token, JWT_SECRET);
      // console.log(`decoded: ${decoded}`);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' ,ok:false});
      } else {
        return res.status(401).json({ error: `Invalid token  ${err}`,ok:false});
      }
    }
    const user = await User.findOne({ signemail: decoded.email }).select('-signpassword');
    if (!user) {
      return res.status(404).json({ error: 'User not found',ok:"false" });
    }

    res.json({ user,ok:"true" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/users', async (req, res) => {
  try {
    const { name, signemail, profession, institution, signpassword } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ signemail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.', ok: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signpassword, 10);

    // Create user
    const user = new User({
      name,
      signemail,
      profession,
      institution,
      signpassword: hashedPassword,
    });

    const savedUser = await user.save();

    // Generate tokens
    const {accessToken,refreshToken} = await user.generateTokens();

    // Send refresh token as httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    };
    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })


    // Send access token in response
    res.status(201).json({ user: savedUser, ok: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error', ok: false });
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

    const { accessToken, refreshToken } = await user.generateTokens();
     const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    };
    await user.addRefreshToken(refreshToken);
    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ msg: "Login successful" ,ok:true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post("/auth/status", (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      authenticated: true,
      user: { id: decoded.id, email: decoded.email },
    });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

router.post('/users/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token, login again',ok:false });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ error: `Invalid or expired refresh token ${err}`,ok:false});
    }
    const user = User.findById(decoded.id);
    const valid = user.hasRefreshToken(refreshToken);
    if (!valid) return res.status(403).json({ error: 'Refresh token not recognized' });

    // Generate new access token
    const {accessToken,newRefreshToken} = user.generateTokens();
    await user.addRefreshToken(newRefreshToken);
    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // true in prod with HTTPS
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false, // true in prod with HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ ok: true, msg: 'Tokens refreshed' ,user: {email:decoded.email}});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/users/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No content

    // Remove the token object by tokenHash
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
       console.log(err);
      return res.status(403).json({ error: `Invalid or expired refresh token ${err}`,ok:false});
    }
    const user = User.findBy(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.removeRefreshToken(refreshToken);

    // Clear cookies
    res.clearCookie("accessToken", { httpOnly: true, sameSite: "None", secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
});



module.exports = router;