const express = require('express');
const bodyParser = require('body-parser');
const App = express();
const cors = require('cors');

App.use(cors());

const Activities = require('./routes/activities')
const Blog = require('./routes/blog');
const Courses = require('./routes/courses');
const Purchases = require('./routes/purchases');

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended:false}));
App.use(express.static(__dirname + '/public'));
App.use('/api/activities', Activities);
App.use('/api/blog', Blog);
App.use('/api/courses', Courses);
App.use('/api/purchases', Purchases);


module.exports = App;