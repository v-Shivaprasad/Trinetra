const mongoose = require('mongoose');
const AlertSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
   About :{
    type:String,
    required:true
   },
   Link:{
    type:String,
    required:true
   }
});

const Alerts = mongoose.model('Alerts',AlertSchema);
module.exports = Alerts;