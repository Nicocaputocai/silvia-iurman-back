const fs = require('fs');
const path = require('path');

const deleteFile= ( file ) => {
    fs.unlinkSync(path.join(__dirname, '../public/img/' + file))
}

module.exports = {
    deleteFile
}