const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials.json');
const {sbucket} = require('../config/constants');
console.log(sbucket);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: sbucket,
});

const bucket = admin.storage().bucket();
module.exports = { bucket };