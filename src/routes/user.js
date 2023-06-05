const {Router} = require('express');

const router = Router();

const {
    loginUser, 
    registerUser, 
    reloggedUser, 
    updateUser, 
    confirmAccount, 
    sendTokenRecovery, 
    recoveryPassword,
    googleLogin,
    getConstellators} = require('../controllers/UserController');

const { getErrors, checkUserLogged  } = require('../middlewares');

const {loginValidation, registerValidation} = require('../validations/auth');

router
.post('/login',loginValidation, getErrors, loginUser)
.post('/register',registerValidation, getErrors, registerUser)
.get('/relogged', checkUserLogged ,reloggedUser)
.put('/update-user', checkUserLogged ,updateUser)
.get('/confirm/:uuid', confirmAccount)
.post('/recovery',sendTokenRecovery)
.post('/recovery-password',recoveryPassword)
.post('/google-login', googleLogin)
.get('/constellators', getConstellators)

module.exports = router;