const mongoose = require('mongoose');
const jwt = require('../node_modules/jsonwebtoken')
const {JWT_SECRET,JWT_REFRESH_SECRET} = require("../config/constants")
const crypto = require("node:crypto")
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
  refreshTokens:[
    {
      tokenHash:{
        type:String
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      ip:{
        type:String
      },
    }
  ]
});

function hashToken(token){
  return crypto.createHash('sha256').update(token).digest('hex');
}

userSchema.methods.generateTokens = async function(){
  try {
    const formattedDate = new Date().toISOString(); 
    this.lastLoggedInDate = formattedDate; 
    await this.save();
    const accessToken = jwt.sign(
      { id: this._id, email: this.signemail },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    const refreshToken = jwt.sign(
      { id: this._id, email: this.signemail, jti: crypto.randomUUID() },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // const refreshHash = hashToken(refreshToken);
    // this.refreshTokens = this.refreshTokens || [];
    // this.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date() });
    // await this.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new Error('Token generation failed');
  }
}


userSchema.methods.addRefreshToken = async function (rawRefreshToken) {
  const refreshHash = hashToken(rawRefreshToken);
  this.refreshTokens = this.refreshTokens || [];
  this.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date() });
  await this.save();
};


userSchema.methods.removeRefreshToken = async function (rawRefreshToken) {
  const refreshHash = hashToken(rawRefreshToken);
  this.refreshTokens = (this.refreshTokens || []).filter(rt => rt.tokenHash !== refreshHash);
  await this.save();
};


userSchema.methods.hasRefreshToken = function (rawRefreshToken) {
  const refreshHash = hashToken(rawRefreshToken);
  return (this.refreshTokens || []).some(rt => rt.tokenHash === refreshHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
