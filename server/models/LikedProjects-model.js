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

likedProjectSchema.methods.removeProject = async function (projectId) {
  try {
    this.likedPro = this.likedPro.filter(project => !project._id.equals(projectId));
    await this.save();
  } catch (error) {
    console.error('Error removing project from likedPro:', error);
    throw error;
  }
};

const LikedProject = mongoose.model('LikedProject', likedProjectSchema);
module.exports = LikedProject;
