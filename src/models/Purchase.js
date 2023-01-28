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
    country:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
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
        required: true,
        default: 0
    },
    finish:{
        type: Boolean,
        required: true,
        default: 0
    },
    course:{
        type: mongoose.Types.ObjectId,
        ref:'Course',
        default:""
    },
    activity:{
        type:mongoose.Types.ObjectId,
        ref:'Activity'
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', PurchasesSchema);

module.exports = Purchase