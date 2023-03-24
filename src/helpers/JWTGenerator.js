const jwt = require('jsonwebtoken');

module.exports = (payload) => jwt.sign(payload, process.env.TOKEN,{
    expiresIn : '4h'
})