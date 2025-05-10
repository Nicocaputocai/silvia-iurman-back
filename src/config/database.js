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
let isConnected = false;

const connectWithRetry = () => {
  console.log('🔁 Intentando conexión a MongoDB...');
  mongoose.connect(CONFIG.DB, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000
  })
  .then(() => {
    isConnected = true;
    console.log('✅ MongoDB conectado');
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      setTimeout(connectWithRetry, 5000);
    });
  })
  .catch(err => {
    console.error(`❌ Error (${new Date().toLocaleTimeString()}):`, err.message);
    setTimeout(connectWithRetry, 5000);
  });
};

// Inicia inmediatamente
connectWithRetry();

// mongoose.set('strictQuery', false);
// const MONGO_URI = CONFIG.DB
// const state = {
//   isConnected: false
// };

// if (!MONGO_URI) {
//   console.error('❌ ERROR: Falta cadena de conexión MongoDB');
//   console.log('Solución:');
//   console.log('1. Para desarrollo: Crea un archivo .env con DB="tu_cadena"');
//   console.log('2. Para producción: Configura la variable DB en Plesk');
//   process.exit(1);
// }


// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 30000,
//       connectTimeoutMS: 10000,
//       maxPoolSize: 10,
//       retryWrites: true
//     });
//     console.log('✅ MongoDB conectado');
    
//     mongoose.connection.on('disconnected', () => {
//       console.log('⚠️ MongoDB desconectado. Reconectando...');
//       setTimeout(connectDB, 5000);
//     });

//   } catch (err) {
//     console.error('❌ Error de conexión inicial:', err.message);
//     console.log('⚠️ Intentando reconexión en 5 segundos...');
//     setTimeout(connectDB, 5000);
//   }
// };
module.exports = {
  isConnected: () => isConnected
};

// module.exports = connectDB;