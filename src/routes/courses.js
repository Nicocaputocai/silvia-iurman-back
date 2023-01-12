const express = require('express');
const router = express.Router();
const CoursesController = require('../controllers/CourseController');
const uploadImg = require('../middlewares/uploadImg');

router.get('/', CoursesController.getAll);
router.post('/create',uploadImg.any(), CoursesController.create);
router.get('show/:_id', CoursesController.find, CoursesController.show);
router.put('/edit/:_id', uploadImg.any(), CoursesController.find, CoursesController.show);
router.delete('/delete/:_id', CoursesController.find, CoursesController.remove)

module.exports = router