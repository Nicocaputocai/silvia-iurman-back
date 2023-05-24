const passwordManager = require('./passwordManager');
const errorResponse = require('./errorResponse');
const JWTGenerator = require('./JWTGenerator');
const generateToken = require('./generateToken');
const {checkoutMP} = require('./mercadopago');
const {checkoutPaypal, paypalToken} = require('./paypal');
const {deleteFile} = require('./deleteFile');

module.exports = {
    passwordManager,
    errorResponse,
    JWTGenerator,
    generateToken,
    checkoutMP,
    checkoutPaypal,
    paypalToken,
    deleteFile
}

