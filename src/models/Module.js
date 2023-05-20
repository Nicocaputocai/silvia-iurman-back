const mongoose = require('mongoose');
const { REF, TYPEMODULE } = require('../types/types');

const ModuleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    typeModule:{
        type: String,
        required: true,
        enum:[TYPEMODULE.PRESENCIAL, TYPEMODULE.VIRTUAL]
    },
    link_intro:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    enabled:{
        type: Boolean,
        default: false
    },
    open:{
        type: Boolean,
        default: false
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
    priceAnticipedDolar:{
        type: Number,
        required: true
    },
},{
    timestamps:true
});

module.exports = mongoose.model(REF.MODULE, ModuleSchema);