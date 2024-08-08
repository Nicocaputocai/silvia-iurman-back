const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');

const allowedOrigins = ['https://www.silviaiurman.com', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones Postman o CURL)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
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

App.use(bodyParser.json())
App.use(bodyParser.urlencoded({extended: true}))
App.use(express.static(__dirname + '/public'));
App.use('/api/activities', Activities);
App.use('/api/auth', Auth)
App.use('/api/blog', Blog);
App.use('/api/courses', Courses);
App.use('/api/purchases', Purchases);
App.use('/api/user', User);
App.use('/api/checkout', Checkouts);
App.use('/api/modules', Modules);
//test
App.use('/api/email', Email);


module.exports = App;