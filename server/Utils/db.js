require('dotenv').config();
const {Connection_string} = require("../config/constants");
const mongoose = require("mongoose");


const connectDb = async () => {
  try {
    await mongoose.connect(Connection_string);
    console.log("connection successful to DB");
  } catch (error) {
    console.error("database connection fail");
    process.exit(0);
  }
};

module.exports = connectDb;
