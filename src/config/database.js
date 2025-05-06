const mongoose = require('mongoose');
const CONFIG = require('./config');
mongoose.set('strictQuery', false);

module.exports = {
  connection: null,
  connect: function () {
    if (this.connection) return Promise.resolve(this.connection);
    return mongoose.connect(CONFIG.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      this.connection = conn;
      console.log('Conexión a Mongoose correcta');
      return conn;
    })
    .catch((err) => {
      console.error('Error conectando a MongoDB:', err);
    });
  }
};
