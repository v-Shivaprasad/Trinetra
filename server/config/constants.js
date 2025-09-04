require('dotenv').config();
module.exports = {
  key: process.env.APP_PASSWORD,
  Admemail: process.env.Admemail,
  Admpass: process.env.Admpass,
  YOUR_EMAIL: process.env.EMAIL,
  sbucket:process.env.firebase_storage_bucket,
};
