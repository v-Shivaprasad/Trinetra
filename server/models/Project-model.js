const mongoose = require('mongoose');

const ProjSchema = new mongoose.Schema({
    ProjectName: {
        type: String,
        unique: true,
        required: true
    },
    Email:{
        type:String,
        
    },
    Description: {
        type: String,
        required: true
    },
    Technology: {
        type: String,
        required: true
    },
    Link:{
        type:String,
        required:true,
        unique: true,
    },
   InstitutionName:{
    type:String,
    required: true,
   },
   File: {
    fileName: {
        type: String,
        required: true,
    },
    filePath:{
        type: String,
        required: true, 
    }
},

Likes: {
    type: Number,
    default: 0,
},

LikedBy: {
    type: [String], 
    default: [],
},

});

ProjSchema.methods.hasUserLiked = function (userEmail) {
    return this.LikedBy.includes(userEmail);
};

ProjSchema.methods.incrementLikes = async function () {
    this.Likes += 1;
    await this.save();
};

ProjSchema.methods.decrementLikes = async function(){
    this.Likes -= 1;
    await this.save();
}

const Proj = mongoose.model('Proj', ProjSchema);

module.exports = Proj;

