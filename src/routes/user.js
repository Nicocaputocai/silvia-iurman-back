const {Router} = require('express');

const router = Router();

const {loginUser, registerUser, reloggedUser, updateUser} = require('../controllers/UserController');

const { getErrors, checkUserLogged  } = require('../middlewares');

const {loginValidation, registerValidation} = require('../validations/auth');

router
.post('/login',loginValidation, getErrors, loginUser)
.post('/register',registerValidation, getErrors, registerUser)
.get('/relogged', checkUserLogged ,reloggedUser)
.put('/update-user', checkUserLogged ,updateUser)

module.exports = router;