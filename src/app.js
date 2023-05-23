const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');

App.use(cors());

const Activities = require('./routes/activities');
const Auth = require('./routes/auth');
const Blog = require('./routes/blog');
const Courses = require('./routes/courses');
const Purchases = require('./routes/purchases');
const User = require('./routes/user');
const Checkouts = require('./routes/checkouts');
const Modules = require('./routes/modules');


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


module.exports = App;