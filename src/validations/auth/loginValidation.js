const { check } = require('express-validator');

const loginValidation = [
    check('user')
    .notEmpty().withMessage('El usuario o email es requerido'),

    check('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres')
]

module.exports = {
    loginValidation
}