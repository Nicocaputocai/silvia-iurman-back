const fs = require('fs');
const path = require('path');

const deleteFile= ( file ) => {
    if(file === 'default_avatar.webp')return;
    fs.unlinkSync(path.join(__dirname, '../public/img/' + file))
}

module.exports = {
    deleteFile
}