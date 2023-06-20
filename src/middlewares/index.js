const checkTokenAdmin = require('./checkTokenAdmin');
const checkUserLogged = require('./checkUserLogged');
const {getErrors} = require('./getErrors');
const uploadImage = require('./uploadImg');
const {processImage} = require('./processToWebp')
module.exports = {
    checkTokenAdmin,
    checkUserLogged,
    getErrors,
    uploadImage,
    processImage
}