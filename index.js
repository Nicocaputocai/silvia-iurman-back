const Database = require('./src/config/database');
const CONFIG = require('./src/config/config');
const App = require('./src/app')

Database.connect();

App.listen(CONFIG.PORT, function(error){
    if(error) return console.log(error);
    console.log(`Servidor corriendo en el puerto ${CONFIG.PORT}`)
})