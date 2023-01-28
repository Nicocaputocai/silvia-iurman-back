const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    day:{
        type: Date,
        default: Date.now()
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
        default: 0
    },
    archived:{
        type: Boolean,
        default: 0
    }
},{
    timestamps:true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity