const express = require('express');
const router = express.Router();

const {loginAdmin, registerAdmin, getAll } = require('../controllers/AuthController');
const checkTokenAdmin = require('../middlewares/checkTokenAdmin');

router
.get('/admin/profile', checkTokenAdmin, getAll)
// .post('/admin/register', registerAdmin)
.post('/admin/login', loginAdmin)

module.exports =router