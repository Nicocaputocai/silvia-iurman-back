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
    pricePesos:{
        type: Number,
        required: true
    },
    priceAnticipedPesos:{
        type: Number,
        required: true
    },
    priceDolar:{
        type: Number,
        required: true
    },
    linkMP:{
        type: String,
        required: true
    },
    linkPP:{
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Course = mongoose.model('Courses', CourseSchema);

module.exports = Course;