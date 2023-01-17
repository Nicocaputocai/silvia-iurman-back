const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    day:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const Course = mongoose.model('Courses', CourseSchema);

module.exports = Course;