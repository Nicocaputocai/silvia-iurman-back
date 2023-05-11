const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutsController');

router.post('/mp', CheckoutController.mercadoPago);
router.post('/mp/status', CheckoutController.captureMercadoPago);

router.post('/pp', CheckoutController.paypal);
router.post('/pp/status', CheckoutController.capturePayPal);

module.exports = router