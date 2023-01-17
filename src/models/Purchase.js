const mongoose = require('mongoose');

const PurchasesSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    Country:{
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
    courseName:{
        type: String,
        required: true
    },
    wayToPay:{
        type: String,
        required: true
    },
    pay:{
        type: Boolean,
        required: true,
        default: 0
    },
    finish:{
        type: Boolean,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchases', PurchasesSchema);

module.exports = Purchase