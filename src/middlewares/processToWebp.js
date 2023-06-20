const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    const imagePath = path.join(req.file.destination, req.file.filename);
  
    sharp(imagePath)
      .toFormat('webp')
      .toFile(imagePath + '.webp', (error) => {
        if (error) {
          return next(error);
        }
  
        // Eliminar la imagen original si no se necesita
        // Puedes comentar esta línea si deseas mantener la imagen original junto con la versión WebP
        fs.unlinkSync(imagePath);
  
        // Actualizar el nombre de archivo en la solicitud para que coincida con la versión WebP
        req.file.filename = req.file.filename.split('.')[0] + '.webp';

        //actualizar el nombre de la imagen carpeta public/img con fs
        fs.renameSync(imagePath + '.webp', path.join(req.file.destination, req.file.filename));

        next();
      });
  };
  
  module.exports = {
    processImage
  };