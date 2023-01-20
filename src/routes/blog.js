const express = require('express');
const router = express.Router();
const BlogController = require('../controllers/BlogController');
const uploadImg = require('../middlewares/uploadImg');

router.get('/', BlogController.getAll);
router.post('/create', uploadImg.any(),BlogController.create);
router.get('/show/:_id', BlogController.find,BlogController.show); //Es el show2 del back de Leo
router.put('/edit/:_id', uploadImg.any(), BlogController.find, BlogController.update); //Es el update2 del back de Leo
router.delete('/delete/:_id', BlogController.find, BlogController.remove) //Es el remove2 del back de Leo

module.exports = router