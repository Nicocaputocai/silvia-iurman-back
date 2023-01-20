const express = require('express');
const router = express.Router();
const uploadImg = require('../middlewares/uploadImg');
const ActivitiesController = require('../controllers/ActivitiesController');

router.get('/', ActivitiesController.getAll);
router.post('/create', uploadImg.any(), ActivitiesController.create);
router.get('/show/:_id', ActivitiesController.find ,ActivitiesController.show);
router.put('/edit/:_id', uploadImg.any(), ActivitiesController.find, ActivitiesController.update);
router.delete('/delete/:_id', ActivitiesController.find, ActivitiesController.remove);

module.exports = router