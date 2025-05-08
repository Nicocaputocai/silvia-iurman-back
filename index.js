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
const App = require('./src/app');
const Database = require('./src/config/database');

// Solo para desarrollo local (elimina en producción)
if (process.env.NODE_ENV !== 'production') {
  App.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor local en puerto ${process.env.PORT || 4000}`);
  });
}

// Conexión a DB en background
Database.connect()
  .then(() => console.log('✅ MongoDB conectado (background)'))
  .catch(err => console.error('⚠️ MongoDB:', err.message));

module.exports = App; // Solo esta línea para Passenger