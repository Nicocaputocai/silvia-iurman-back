const express = require('express');
const router = express.Router();

const {loginAdmin, registerAdmin} = require('../controllers/AuthController');

router
// .post('/admin/register', registerAdmin)
.post('/admin/login', loginAdmin)

module.exports =router