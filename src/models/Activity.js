const mongoose = require('mongoose');
const { REF } = require('../types/types');
const { toString } = require('express-validator/src/utils');

const ActivitySchema = new mongoose.Schema({
    day:{
        type: Date,
        default: Date.now()
    },
    title:{
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
    },
    associate: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'associateModel',
      },
    associateModel: {
        type: String,
        enum: [
            REF.COURSE,
            REF.MODULE,
        ],
    },
},{
    timestamps:true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity