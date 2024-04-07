require('dotenv').config();
const connection = process.env.MONGO_CONNECTION_STRING;
const mongoose = require("mongoose");



const connectDb = async () => {
  try {
    await mongoose.connect(connection);
    console.log("connection successful to DB");
  } catch (error) {
    console.error("database connection fail");
    process.exit(0);
  }
};

module.exports = connectDb;