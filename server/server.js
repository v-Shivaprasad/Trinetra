const express = require('express');
const cors = require('cors');
const authRoutes = require('./controllers/auth-controller');
const path = require('path');
require('dotenv').config();
const app = express();
const connectDb = require('./Utils/db');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDb(); 


// Use auth routes
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});