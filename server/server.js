const express = require('express');
const cors = require('cors');
const routes = require('./controllers/Authentication-routes');
const path = require('path');
require('dotenv').config();
const app = express();
const connectDb = require('./Utils/db');
const PORT = process.env.PORT || 3001;
const cookieParser = require("cookie-parser");


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,               
  })
);
app.use(express.json());
app.use(cookieParser());

connectDb(); 


app.use('/api',routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});