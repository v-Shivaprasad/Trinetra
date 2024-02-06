const mongoose = require('mongoose');

const likedProjectSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  likedPro: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proj', // Reference to your Proj model
      required: true,
    },
  }],
});

const LikedProject = mongoose.model('LikedProject', likedProjectSchema);
module.exports = LikedProject;