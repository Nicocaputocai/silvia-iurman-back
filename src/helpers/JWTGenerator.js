const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (payload) => jwt.sign(payload, config.TOKEN_JWT ,{
    expiresIn : '7d'
})