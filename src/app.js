const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');

// Manejo de solicitudes OPTIONS (preflight)
App.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite todos los orígenes
  optionsSuccessStatus: 200,
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'] // Incluye Authorization
};

App.use(cors(corsOptions));

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
