const checkTokenAdmin = require('./checkTokenAdmin');
const checkTokenUser = require('./checkTokenUser');
const {getErrors} = require('./getErrors');
const uploadImage = require('./uploadImg');

module.exports = {
    checkTokenAdmin,
    checkTokenUser,
    getErrors,
    uploadImage
}