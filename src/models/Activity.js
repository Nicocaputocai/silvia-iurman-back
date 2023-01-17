const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    day:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true
    },
    modality:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    important:{
        type: Boolean,
        required: true,
        default: 0
    },
    archived:{
        type: Boolean,
        required: true,
        default: 0
    }
},{
    timestamps:true
});

const Activity = mongoose.model('Activities', ActivitySchema);

module.exports = Activity