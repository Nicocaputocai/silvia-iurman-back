const User = require("../models/User");
const createError = require('http-errors');
const {errorResponse, JWTGenerator } = require('../helpers');

module.exports = {
    getAll: async(req,res) =>{
        try {
            const users = await User.find();
            return res.status(200).json({
                ok: true,
                users
            })
        } catch (error) {
            if(error.status !== 500){
                return res.status(error.status).json({
                    ok: false,
                    msg: error.message || 'upss, hubo un error'
                })
            }
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
        }
    },

    registerUser: async(req,res) =>{
        try {
            const data = {
                username: req.body.username.toLowerCase().trim(),
                email: req.body.email.toLowerCase().trim(),
                password: req.body.password,
            }

            let user = await User.findOne({
                $or: [
                    {username: data.username},
                    {email: data.email}
                ]
            });

            if(user){
                throw createError(400, 'Usuario o email ya existente')
            }

            user = new User(data);
            const userStore = await user.save();

            return res.status(201).json({
                ok: true,
                msg: 'Usuario registrado',
                user: {
                    name: userStore.username,
                    email: userStore.email,
                    _id: userStore._id
                },
                token: JWTGenerator({
                    id: userStore._id
                })
            })

        } catch (error) {
            return errorResponse(res,error, "Error en el registro")
        }
    },

    loginUser: async(req,res) =>{
        try{
            const {user, password} = req.body;

            let userDB = await User.findOne({
                $or: [
                    {username: user.toLowerCase().trim()},
                    {email: user.toLowerCase().trim()}
                ]
            })
            .populate('activity')
            .populate('courses')
            .populate('modules')

            if(!userDB){
                throw createError(400, 'Usuario o contraseña incorrectos')
            }

            if(!await userDB.checkedPassword(password)){
                throw createError(400, 'Usuario o contraseña incorrectos')
            }
            return res.status(200).json({
                ok: true,
                msg: 'Usuario logueado',
                user: {
                    firstName: userDB.firstName,
                    lastName: userDB.lastName,
                    country: userDB.country,
                    dateOfBirth: userDB.dateOfBirth,
                    phone: userDB.phone,
                    name: userDB.username,
                    email: userDB.email,
                    role: userDB.role,
                    avatar: userDB.avatar,
                    activity: userDB.activity,
                    courses: userDB.courses, 
                    modules: userDB.modules,
                },
                token: JWTGenerator({
                    id: userDB._id
                })
            })
        } catch (error) {
            console.log(error);
            return errorResponse(res,error, "Error en el login")
        }
    },
    reloggedUser: async(req,res) =>{
        try {
            return res.status(200).json({
                ok: true,
                msg: 'Usuario logueado',
                user: {
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    country: req.user.country,
                    dateOfBirth: req.user.dateOfBirth,
                    phone: req.user.phone,
                    name: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    avatar: req.user.avatar,
                    activity: req.user.activity,
                    courses: req.user.courses, 
                    modules: req.user.modules,
                },
                token: JWTGenerator({
                    id: req.user._id
                })
            })
        } catch(error) {
            return errorResponse(res,error, "Error en el login");
        }
    },
    updateUser: async(req,res) =>{
        const {birthday, country, firstName, lastName, phone} = req.body;

        try {
            const user = await User.findByIdAndUpdate(req.user._id,{
                dateOfBirth: birthday,
                country,
                firstName,
                lastName,
                phone},{new: true});

            return res.status(200).json({
                ok: true,
                msg: 'Usuario actualizado',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    country: user.country,
                    dateOfBirth: user.dateOfBirth,
                    phone: user.phone,
                    name: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    activity: user.activity,
                    courses: user.courses,
                    modules: user.modules,
                },
                token: JWTGenerator({
                    id: user._id
                })
            })
        } catch (error){
            console.log(error);
        }
    }
}