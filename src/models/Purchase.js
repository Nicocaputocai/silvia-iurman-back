const mongoose = require('mongoose');
const { REF, TYPETOPAY } = require('../types/types');

const PurchaseSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: REF.USER,
        required: true
    },
    wayToPay:{
        type: String,
        required: true,
        enum: [TYPETOPAY.MP, TYPETOPAY.PP, TYPETOPAY.TRANS]
    },
    inscription:{
        type: String,
        required: true
    },
    pay:{
        type: Boolean,
        default: false
    },
    finish:{
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase