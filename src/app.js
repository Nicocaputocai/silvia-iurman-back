const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Database = require('./config/database');

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'], // Encabezados permitidos
  optionsSuccessStatus: 200, // Código de éxito para opciones preflight
};

App.use(cors(corsOptions));
App.use(express.json());
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

App.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    dbState: 'not-connected' 
  });
});
App.use('/api/activities', Activities);
App.use('/api/auth', Auth);
App.use('/api/blog', Blog);
App.use('/api/courses', Courses);
App.use('/api/purchases', Purchases);
App.use('/api/user', User);
App.use('/api/checkout', Checkouts);
App.use('/api/modules', Modules);
App.use('/api/email', Email);
App.get('/api/test', (req, res) => {
  res.send('API funcionando');
});



App.get('/api/debug', (req, res) => {
  res.json({
    dbConnected: Database.getStatus(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// Middleware para verificar DB en rutas críticas
App.use((req, res, next) => {
  if (req.path.startsWith('/api') && !Database.getStatus()) {
    return res.status(503).json({ 
      error: 'DB no conectada',
      routesAvailable: ['/api/test', '/api/health']
    });
  }
  next();
});

module.exports = App;

