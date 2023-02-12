const mongoose = require('mongoose');
const {hash, compare} = require('bcryptjs')

const adminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    }
});

adminSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    };
    this.password = await hash(this.password, 10);
    
});

adminSchema.methods.checkedPassword = async function(password){
    return await compare(password, this.password)
};

module.exports = mongoose.model('Admin', adminSchema);