const express = require('express');
const router = express.Router();
const ModulesController = require('../controllers/ModuleController');

router.get('/', ModulesController.getAll);
router.post('/create-all', ModulesController.createAll);
router.get('/delete-all', ModulesController.deleteAll);
router.get('/:id', ModulesController.getById);
router.post('/create',ModulesController.create);
router.delete('/delete/:id', ModulesController.delete);

module.exports = router