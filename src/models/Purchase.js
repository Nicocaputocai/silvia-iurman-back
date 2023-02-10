const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    wayToPay:{
        type: String,
        required: true
    },
    pay:{
        type: Boolean,
        default: 0
    },
    finish:{
        type: Boolean,
        default: 0
    },
    inscription:{
        type: String,
        default:""
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase