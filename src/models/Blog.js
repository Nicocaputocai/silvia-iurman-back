const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true
    },
    paragraph:{
        type: String,
        required: true
    },
    archived:{
        type: Boolean,
        required: true,
        default: 0
    }
},{
    timestamps: true
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog