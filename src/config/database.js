const mongoose = require('mongoose');
const CONFIG = require('./config');
mongoose.set('strictQuery', false);

module.exports = {
    conection: null,
    connect: function(){
        if(this.connection) return this.connection;
        return mongoose.connect(CONFIG.DB)
        .then(connection =>{
            this.connection = connection;
            console.log('Conexión a Mongoose correcta');
        })
        .catch (err => console.log(err))
    }
}