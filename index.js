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
const fs = require('fs');
const path = require('path');
const CONFIG = require('./src/config/config');
const App = require('./src/app');
require('dotenv/config');

// 1. Configuración del sistema de logs
const logsDir = path.join(__dirname, 'tmp/logs');
const logFile = path.join(logsDir, 'app.log');

// Crear directorio de logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Función para escribir logs
const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('❌ Error escribiendo log:', err);
  });

  // Mostrar también en consola
  console[level === 'ERROR' ? 'error' : 'log'](logMessage.trim());
};

// 2. Configuración de Passenger
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
  log('Configuración de Passenger completada');
}

// 3. Conexión a MongoDB con logging
const MONGO_URI = process.env.DB || `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.wug6n.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  waitQueueTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
})
.then(() => log('✅ MongoDB conectado (Método Passenger)'))
.catch(err => {
  log(`❌ Error MongoDB: ${err.message}`, 'ERROR');
});

// 4. Middleware de logging para solicitudes
App.use((req, res, next) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  log(`Solicitud: ${req.method} ${req.url} | DB: ${dbState}`);
  
  if (dbState === 'disconnected') {
    log(`⚠️ Solicitud recibida sin conexión a DB: ${req.url}`, 'WARN');
  }
  
  next();
});

// 5. Ruta de verificación de salud con logging
App.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  log(`Health check | DB: ${dbState}`);
  
  res.json({
    status: 'OK',
    dbState,
    timestamp: new Date().toISOString()
  });
});

// 6. Inicio del servidor con logging
if (typeof PhusionPassenger !== 'undefined') {
  App.listen('passenger', () => {
    log('🛫 Servidor iniciado en modo Passenger');
  });
} else {
  const PORT = process.env.PORT || 4000;
  App.listen(PORT, () => {
    log(`🚀 Servidor local en puerto ${PORT}`);
  });
}

// 7. Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  log(`💥 Error no capturado: ${err.stack}`, 'ERROR');
});

process.on('unhandledRejection', (reason) => {
  log(`⚠️ Promise rechazada: ${reason}`, 'ERROR');
});

// 8. Exportación para Passenger
module.exports = App;