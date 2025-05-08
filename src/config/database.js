// const mongoose = require('mongoose');
// const CONFIG = require('./config');
// mongoose.set('strictQuery', false);

// module.exports = {
//     conection: null,
//     connect: function(){
//         if(this.connection) return this.connection;
//         return mongoose.connect(CONFIG.DB)
//         .then(connection =>{
//             this.connection = connection;
//             console.log('Conexión a Mongoose correcta');
//         })
//         .catch (err => console.log(err))
//     }
// }

// comentado 2
// const mongoose = require('mongoose');
// const CONFIG = require('./config');

// mongoose.set('strictQuery', false);

// let isConnected = false;
// let retryCount = 0;

// const connectDB = async () => {
//   if (isConnected) return;
  
//   try {
//     await mongoose.connect(CONFIG.DB, {
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 30000,
//       connectTimeoutMS: 10000
//     });
//     isConnected = true;
//     console.log('✅ MongoDB conectado');
//   } catch (err) {
//     console.error(`❌ Intento ${retryCount + 1} de conexión falló`);
//     retryCount++;
    
//     // Reintenta cada 5 segundos
//     if (retryCount < 5) {
//       setTimeout(connectDB, 5000);
//     }
//   }
// };
const mongoose = require('mongoose');
const CONFIG = require('./config');

mongoose.set('strictQuery', false);

const connectionState  = {
  isConnected: false,
  retryCount: 0
};

const connectDB = async () => {
  if (connectionState .isConnected) return true;
  
  try {
    await mongoose.connect(CONFIG.DB, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    connectionState .isConnected = true;
    console.log('✅ MongoDB conectado');
    return true;
  } catch (err) {
    console.error(`❌ Intento ${state.retryCount + 1} fallido`);
    connectionState .retryCount++;
    
    if (connectionState .retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB();
    }
    return false;
  }
};

module.exports = { 
  connect: connectDB,
  getStatus: () => connectionState .isConnected
};
// Añade este método
const getStatus = () => connectionState.isConnected;

module.exports = { 
  connect: connectDB,
  getStatus // Exporta el método
};