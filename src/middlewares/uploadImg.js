const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'src/public/img')
    },
    filename: (req, file, callback) =>{
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, callback) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = path.extname(file.originalname).toLowerCase();
  
    if (allowedExtensions.includes(extension)) {
      callback(null, true);
    } else {
      callback(new Error('El archivo no es una imagen'));
    }
  };

module.exports = multer({storage,fileFilter})