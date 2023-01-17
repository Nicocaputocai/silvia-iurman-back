const express = require('express');
const router = express.Router();
const ActivitiesController = require('../controllers/ActivitiesController');

router.get('/', ActivitiesController.getAll);
router.post('/create', ActivitiesController.create);
router.get('/show/:_id');
router.put('/edit/:id', ActivitiesController.update);
router.delete('/delete/:_id', ActivitiesController.remove);

module.exports = router