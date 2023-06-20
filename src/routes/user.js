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
    getConstellators,
    updateProfileImage} = require('../controllers/UserController');

const { getErrors, checkUserLogged,uploadImage  } = require('../middlewares');

const {loginValidation, registerValidation} = require('../validations/auth');

router
.post('/login',loginValidation, getErrors, loginUser)
.post('/register',registerValidation, getErrors, registerUser)
.get('/relogged', checkUserLogged ,reloggedUser)
<<<<<<< HEAD
.put('/update-user', checkUserLogged, uploadImg.any(), updateUser)
=======
.put('/update-user', checkUserLogged, updateUser)
.put('/update-avatar-user', checkUserLogged, uploadImage.single('avatar'), getErrors, updateProfileImage)
>>>>>>> profile
.get('/confirm/:uuid', confirmAccount)
.post('/recovery',sendTokenRecovery)
.post('/recovery-password',recoveryPassword)
.post('/google-login', googleLogin)
.get('/constellators', getConstellators)

module.exports = router;