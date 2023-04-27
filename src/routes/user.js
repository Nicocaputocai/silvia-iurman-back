const {Router} = require('express');

const router = Router();

const {loginUser, registerUser, reloggedUser} = require('../controllers/UserController');

const { getErrors, checkUserLogged  } = require('../middlewares');

const {loginValidation, registerValidation} = require('../validations/auth');

router
.post('/login',loginValidation, getErrors, loginUser)
.post('/register',registerValidation, getErrors, registerUser)
.get('/relogged', checkUserLogged ,reloggedUser)

module.exports = router;