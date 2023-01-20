const express = require('express');
const router = express.Router();
const PurchasesController = require('../controllers/PurchasesController');

router.get('/', PurchasesController.getAll);
router.post('/create', PurchasesController.create);
router.get('/show/:_id', PurchasesController.find, PurchasesController.show);
router.put('/edit/:_id', PurchasesController.find, PurchasesController.update);
router.delete('/delete/:_id', PurchasesController.find, PurchasesController.remove)

module.exports = router