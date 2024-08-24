const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'], // Encabezados permitidos
  optionsSuccessStatus: 200, // Código de éxito para opciones preflight
};

// Usa el middleware CORS con las opciones configuradas
App.use(cors(corsOptions));

// // Manejo de solicitudes OPTIONS (preflight) si es necesario
// App.options('*', cors(corsOptions));
const Activities = require('./routes/activities');
const Auth = require('./routes/auth');
const Blog = require('./routes/blog');
const Courses = require('./routes/courses');
const Purchases = require('./routes/purchases');
const User = require('./routes/user');
const Checkouts = require('./routes/checkouts');
const Modules = require('./routes/modules');
const Email = require('./routes/email');

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));
App.use(express.static(__dirname + '/public'));
App.use('/api/activities', Activities);
App.use('/api/auth', Auth);
App.use('/api/blog', Blog);
App.use('/api/courses', Courses);
App.use('/api/purchases', Purchases);
App.use('/api/user', User);
App.use('/api/checkout', Checkouts);
App.use('/api/modules', Modules);
App.use('/api/email', Email);

module.exports = App;
