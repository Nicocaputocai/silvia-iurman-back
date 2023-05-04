const User = require("../models/User");
const createError = require('http-errors');
const {errorResponse, JWTGenerator, generateToken, passwordManager} = require('../helpers')
/* const {confirmRegister, forgotPassword} = require('../helpers/sendMails') */

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
            });

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
                    name: userDB.username,
                    email: userDB.email,
                    role: userDB.role,
                    _id: userDB._id
                },
                token: JWTGenerator({
                    id: userDB._id
                })
            })
        } catch (error) {
            return errorResponse(res,error, "Error en el login")
        }
    },
    reloggedUser: async(req,res) =>{
        try {
            return res.status(200).json({
                ok: true,
                msg: 'Usuario logueado',
                user: {
                    name: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    _id: req.user._id
                },
                token: JWTGenerator({
                    id: req.user._id
                })
            })
        } catch {
            return errorResponse(res,error, "Error en el login");
        }
    }
}