const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.use('/', authController);

module.exports = router;