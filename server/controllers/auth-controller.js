const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const router = express.Router();
//models-mongoose
const { User, Proj, savedPro, LikedProject, Alerts } = require('../models/models');



const bucket = require('../Firebase/firebase')
const upload = multer({
  storage: multer.memoryStorage(),
});


router.post('/uploadProjects', upload.single('File'), async (req, res) => {
  try {
    // Save the project details to MongoDB with the Firebase Storage URL
    const fileBuffer = req.file.buffer;
    const fileName = `${req.file.fieldname}_${Date.now()}${path.extname(req.file.originalname)}`;
    const proj = new Proj({
      ProjectName: req.body.Name,
      Technology: req.body.Tech,
      Description: req.body.Description,
      Link: req.body.Link,
      Email: req.body.Email,
      InstitutionName: req.body.InstitutionName,
      File: {
        fileName: fileName,
        filePath: `gs://${bucket.name}/${fileName}`,
      },
    });

    const result = await proj.save();
    await User.findOneAndUpdate(
      { signemail: req.body.Email },
      { $inc: { ProjectsUploaded: 1 } }
    );

    const file = bucket.file(fileName);
    await file.save(fileBuffer);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the limit' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation Error', validationErrors: error.errors });
    }

    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.ProjectName) {
        return res.status(400).json({ error: 'Choose a different Project name', keyValue: error.keyValue });
      }

      if (error.keyPattern && error.keyPattern.Link) {
        // Custom response for duplicate key error on Link
        return res.status(400).json({ error: 'Project with this Link already exists', keyValue: error.keyValue });
      }
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/GetAlerts',async(req,res)=>{
  try {
    const Alert = mongoose.model('Alerts');
    const respo = await Alert.find();
    res.json(respo);
  } catch (error) {
    console.log(error);
  }
})
router.post('/setAlert',async(req,res)=>{
  try {
    const alerts = new Alerts({
      Title: req.body.Name,
      About: req.body.Description,
      Link:req.body.Link
    });
    console.log(alerts);
     const result = await alerts.save();
     res.status(201).json({result:result, ok:true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

 
})

router.delete('/DeleteAlert/:id', async (req, res) => {
  try {
    const alertId = req.params.id;

    // Validate if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(alertId)) {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }

    // Delete the alert from MongoDB
    const deletedAlert = await Alerts.findByIdAndDelete(alertId);

    if (!deletedAlert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/FindProfile', async (req, res) => {
  try {
    const Profile = await User.findOne({ signemail: req.query.email });
    
    if (Profile) {
      res.json({ Profile });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Retrieve favorites in dasboard save Earlier
router.get('/GetFav', async (req, res) => {
  try {
    
    const userSavedData = await savedPro.findOne({ userEmail: req.query.email }).populate('SavedPro._id');
    // console.log(userSavedData);
    if (!userSavedData) {

      return res.status(404).json({ error: 'User not found' });
    }

    const favoriteProjects = userSavedData.SavedPro;
    // console.log(favoriteProjects)
    res.json({ favoriteProjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Save the Projects in the dashboard
router.post('/savedPro', async (req, res) => {
  try {
    const Proj = mongoose.model('Proj');
    const { email, Pro } = req.body;
    // console.log(Pro.Title);

  
    const project = await Proj.findById({_id:Pro._id});

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if a document with the given userEmail already exists
    const userSaved = await savedPro.findOne({ userEmail: email });

    if (userSaved) {
      // Check if the project is already saved in the array
      const isProjectAlreadySaved = userSaved.SavedPro.some(savedProject => savedProject._id.equals(project._id));
    
      if (!isProjectAlreadySaved) {
        // If it's not saved, push the new project into the SavedPro array
        userSaved.SavedPro.push({ _id: project._id });
        await userSaved.save();
        res.status(200).json({ message: 'Project added to existing userSaved document' ,ok:true});
      } else {
        // If it's already saved, you might want to send a different response
        res.status(200).json({ message: 'Project already saved for the user' });
      }
    } else {
      // If it doesn't exist, create a new userSaved document
      const newUserSaved = new savedPro({
        userEmail: email,
        SavedPro: [{ _id: project._id }],
      });
    
      const result = await newUserSaved.save();
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Get Liked Projects
router.get('/FindLikedProjects',async(req,res) =>{
  try {
    const email = req.query.email;
    const userLikedProject = await LikedProject.findOne({userEmail:email});
    if(!userLikedProject){
      return res.status(404).json("User did not save projects till now")
    }
    const Liked = userLikedProject.likedPro;
    res.status(200).json({Liked})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal Server Error"});
  }
})

//Post Liked Projects
router.post('/like-project', async (req, res) => {
  try {
    const { email, project, action } = req.body;

    // Find the project by its ID
    const existingProject = await Proj.findById({ _id: project._id });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the user has already liked the project
    const userLikedProject = await LikedProject.findOne({ userEmail: email });

    if (userLikedProject) {
      const isLiked = userLikedProject.likedPro.some(likedProject => likedProject._id.equals(existingProject._id));

      if (action === 'like') {
        if (!isLiked) {
          userLikedProject.likedPro.push({ _id: existingProject._id });
          await existingProject.incrementLikes(email);
          await userLikedProject.save();
          return res.status(200).json({ message: 'Project liked successfully' });
        } else {
          return res.status(409).json({ message: 'Project already liked by the user' });
        }
      } else if (action === 'unlike') {
        if (isLiked) {
          await userLikedProject.removeProject(existingProject._id);
          await existingProject.removeUserLike(email);
          await existingProject.decrementLikes();
          return res.status(200).json({ message: 'Project unliked successfully' });
        } else {
          return res.status(409).json({ message: 'Project not liked by the user' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid action parameter' });
      }
    } else {
      if (action === 'like') {
        const newUserLiked = new LikedProject({
          userEmail: email,
          likedPro: [{ _id: existingProject._id }],
        });

        await newUserLiked.save();
        await existingProject.incrementLikes();
        return res.status(200).json({ message: 'Project liked successfully' });
      } else {
        return res.status(409).json({ message: 'Project not liked by the user' });
      }
    }
  } catch (error) {
    console.error('Error processing like/unlike:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





//Unsave the Projects
// Remove the Projects from the dashboard
router.post('/removeSavedPro', async (req, res) => {
  try {
    const Proj = mongoose.model('Proj');
    const { email, id } = req.body;

    const project = await Proj.findById({ _id: id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if a document with the given userEmail exists
    const userSaved = await savedPro.findOne({ userEmail: email });

    if (userSaved) {
      // Check if the project is saved in the array
      const savedProjectIndex = userSaved.SavedPro.findIndex(savedProject => savedProject._id.equals(project._id));

      if (savedProjectIndex !== -1) {
        // If the project is found, remove it from the SavedPro array
        userSaved.SavedPro.splice(savedProjectIndex, 1);
        await userSaved.save();
        res.status(200).json({ message: 'Project removed from userSaved document' });
      } else {
        // If the project is not found, you might want to send a different response
        res.status(200).json({ message: 'Project not found in the user\'s saved projects' });
      }
    } else {
      // If the document doesn't exist, you might want to send a different response
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/ValidateToken', async (req, res) => {
  const token = req.query.token;
  // console.log(token);
  try {
    const verified = jwt.verify(token, 'Brahmi_delta_force');
    if(verified){
    res.status(200).json({ validToken: true, decoded: verified });
    }
    else{
      localStorage.removetem("token");
    }
    

  } catch (error) {
    // console.error(error); 
    res.status(401).json({ validToken: false, error: 'Invalid token' });
  }
});

//fetch USers
router.get('/FetchUsers',async(req,res) =>{
  try {
    const Profiles = await User.find();
    res.json(Profiles);
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }
})


//fetch Projects
router.get('/FindAllProjects',async(req,res) =>{
  try {
    const Proj = mongoose.model('Proj');
    const Pro1 = await Proj.find();
    res.json(Pro1);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
//Fetch Uploaded Projects
router.get('/UploadedProjects', async (req, res) => {
  try {
    const Proj = mongoose.model('Proj');
    const projl = await Proj.find({ Email: req.query.email });

    res.json(projl);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error'); 
  }
});

//Update Values in the uploaded Project
router.post('/UpdateProjectfields', async (req, res) => {
  const { id, updatedFields } = req.body;
  console.log(req.body);
  console.log('Received request to update project with ID:', id);

  try {
    // Find the project by id and update the fields
    const updatedProject = await Proj.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json({
      message: 'Project fields updated successfully',
      updatedProject,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate pdf Link from Firebase
router.get('/reportLinkGenerator', async (req, res) => {
  try {

    const fileName = req.query.fileName;
    const resp = await Proj.findOne({"File.fileName": fileName});
    console.log(fileName, resp);
    if(!resp) {
    return  res.status(404).send("No such file exists!!");
    }
    const [signedUrl] = await storage.bucket().file(fileName).getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // Link expires in 1 hour
    });
    res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//extract institution name
router.get('/findInst', async (req, res) => {
  try {
    const User = mongoose.model('User'); 
    const userObj = await User.findOne({ signemail: req.query.email });
    // console.log(userObj);
    if (userObj) {
      const institutionName = userObj.institution;
      // console.log(institutionName);
      res.json({ institution: institutionName });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
