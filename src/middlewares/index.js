const checkTokenAdmin = require('./checkTokenAdmin');
const checkUserLogged = require('./checkUserLogged');
const {getErrors} = require('./getErrors');
const uploadImage = require('./uploadImg');

module.exports = {
    checkTokenAdmin,
    checkUserLogged,
    getErrors,
    uploadImage
}