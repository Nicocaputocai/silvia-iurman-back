const { check } = require('express-validator');

const registerValidation = [
    check('username', 'El nombre es requerido').notEmpty(),

    check('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido'),

    check('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres')
]

module.exports = {
    registerValidation
}