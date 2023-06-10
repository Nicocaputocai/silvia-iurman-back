const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutsController');
const checkUserLogged = require('../middlewares/checkUserLogged');

router.post('/mp', checkUserLogged, CheckoutController.mercadoPago);
router.post('/mp/status', checkUserLogged, CheckoutController.captureMercadoPago);

router.post('/pp', checkUserLogged, CheckoutController.paypal);
router.post('/pp/status', checkUserLogged, CheckoutController.capturePayPal);

module.exports = router