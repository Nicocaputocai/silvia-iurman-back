// const Database = require('./src/config/database');
// const CONFIG = require('./src/config/config');
// const App = require('./src/app')

// Database.connect();

// App.listen(CONFIG.PORT, function(error){
//     if(error) return console.log(error);
//     console.log(`Servidor corriendo en el puerto ${CONFIG.PORT}`)
// })


// // 2. Exporta la app INMEDIATAMENTE (para que Passenger pueda spawnear)
// module.exports = App;

// // 3. Conexiones/consultas en segundo plano (asíncronas)
// setTimeout(() => {
//   require('./src/config/database').connect()
//     .then(() => console.log('✅ MongoDB conectado (background)'))
//     .catch(err => console.error('⚠️ MongoDB falló (app ya iniciada):', err));
// }, 1000);


const express = require('express');
const mongoose = require('mongoose');
const CONFIG = require('./src/config/config');
const App = require('./src/app');
require('dotenv/config');

// 1. Configuración inicial de Passenger
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}
const MONGO_URI =  process.env.DB || `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.wug6n.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  waitQueueTimeoutMS: 10000, // Nuevo parámetro clave
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('✅ MongoDB conectado (Método Passenger)'))
.catch(err => console.error('❌ Error MongoDB (No crítico):', err.message));
// 3. Ruta de verificación de salud
App.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 3. Inicio condicional del servidor
if (typeof PhusionPassenger !== 'undefined') {
  App.listen('passenger');
  console.log('🛫 Modo Passenger activado');
} else {
  App.listen(4000);
  console.log('🚀 Servidor local en puerto 4000');
}

// 4. Middleware de verificación
App.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ Solicitud recibida sin conexión a DB');
  }
  next();
});
// 4. Exportación para Passenger
module.exports = App;