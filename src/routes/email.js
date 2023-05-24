const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/test', emailController.sendEmail);

module.exports = router