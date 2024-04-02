const mongoose = require('mongoose');
const jwt = require('../node_modules/jsonwebtoken')
require('dotenv').config();
const key = process.env.MONGO_KEY
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  signemail: {
    type: String,
    required: true,
    unique: true,
  },
  profession: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: function () {
      return this.profession === 'Student' || this.profession === 'Teacher';
    },
  },
  signpassword: {
    type: String,
    required: true,
  },
  lastLoggedInDate: {
    type: Date,
    default: null,
  },
  ProjectsUploaded:{
    type: Number,
    default: 0,
  },
});

userSchema.methods.generateToken = async function () {
  try {
    const formattedDate = new Date().toISOString(); // Get current date and time in ISO format
    this.lastLoggedInDate = formattedDate; // Save formatted date
    await this.save();

    const token = jwt.sign(
      { userName: this.name, email: this.signemail, lastLoggedInDate: formattedDate },
      key,
      { expiresIn: '1h' }
    );

    return token;
  } catch (error) {
    // Handle error (e.g., log it or throw a custom error)
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
