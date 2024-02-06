const mongoose = require('mongoose');
const userSavedSchema = new mongoose.Schema({
  userEmail :{
    type: String,
    required : true
  },
  SavedPro :[{
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proj',
        required: true,
      },
      savedAt: {
        type: Date,
        default: Date.now,
      },
  }]
})

const userSaved = mongoose.model('userSaved',userSavedSchema);
module.exports =userSaved;