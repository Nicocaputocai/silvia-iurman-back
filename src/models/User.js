const {ROLES, REF} = require('../types/types')
const mongoose = require('mongoose');
const {hash, compare} = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    country:{
        type: String,
    },
    dateOfBirth:{
        type: String,
    },
    phone:{
        type: String,
    },
    username:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: [ROLES.ADMIN, ROLES.USER],
        default: ROLES.USER
    },
    google: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'default_avatar.webp'
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    uuid: {
        type: String,
        default: ''
    },
    constellator:{
        type: Boolean,
        default: false
    },
    activity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: REF.ACTIVITY
        }
    ],
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: REF.COURSE
        }
    ],
    modules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: REF.MODULE
        }
    ]
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    };
    this.password = await hash(this.password, 10);
    
});

userSchema.methods.checkedPassword = async function(password){
    return await compare(password, this.password)
};

module.exports = mongoose.model(REF.USER, userSchema);