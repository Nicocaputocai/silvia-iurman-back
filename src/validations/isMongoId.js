const {check} = require('express-validator');

const registerValidation = [
    check('id')
    .isMongoId().withMessage('El id no es válido')
]

module.exports = {
    registerValidation
}