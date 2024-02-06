const mongoose = require('mongoose');
const jwt = require('../node_modules/jsonwebtoken')
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
});

userSchema.methods.generateToken = function () {
  try {
    const token = jwt.sign(
      { userName: this.name, email: this.signemail },
      'Brahmi_delta_force',
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
