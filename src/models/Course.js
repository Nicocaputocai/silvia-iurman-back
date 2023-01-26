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
        required: false,
        default:0
    },
    priceDolar:{
        type: Number,
        required: false,
        default:0
    }
},{
    timestamps: true
});

const Course = mongoose.model('Courses', CourseSchema);

module.exports = Course;