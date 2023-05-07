const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutsController');

router.post('/mp', CheckoutController.mercadoPago);
router.post('/pp', CheckoutController.paypal);

module.exports = router