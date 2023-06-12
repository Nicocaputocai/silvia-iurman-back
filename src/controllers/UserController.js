const User = require("../models/User");
const createError = require('http-errors');
const {errorResponse, JWTGenerator, generateToken } = require('../helpers');
const { confirmRegister, forgotPassword } = require("../helpers/sendMails");
const { request } = require("express");
const Purchase = require("../models/Purchase");
const { REF } = require("../types/types");

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
            const uuid = generateToken();
            data.uuid = uuid;
            user = new User(data);
            const userStore = await user.save();

            await confirmRegister({
                email: userStore.email,
                name: userStore.username,
                uuid: userStore.uuid
            })

            return res.status(201).json({
                ok: true,
                msg: 'Usuario registrado, revise su correo para confirmar la cuenta',
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
            const token = JWTGenerator({
                id: userDB._id
            })
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
                token
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
                phone},{new: true})
                .populate('activity')
                .populate('courses')
                .populate('modules');

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
    },
    confirmAccount: async(req,res) =>{
        const {uuid} = req.params;
        try {
            const user = await User.findOne({uuid});
            if(!user){
                throw createError(400, 'Usuario no encontrado')
            }
            await User.findByIdAndUpdate(user._id,{
                confirmed: true,
            });
            return res.status(200).json({
                ok: true,
                msg: 'Usuario confirmado'
            })
        } catch (error) {
            return errorResponse(res,error, "Error en el confirmar usuario")
        }
    },
    sendTokenRecovery:async(req,res) =>{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            })
        }   
        await forgotPassword({
            name: user.username,
            email: user.email,
            uuid: user.uuid
        })

        return res.status(200).json({
            ok: true,
            msg: 'Se ha enviado un email con instrucciones'
        })
        
    },
    recoveryPassword: async (req,res) =>{
        const {password, uuid} = req.body;
        try {
            const user = await User.findOne({uuid});
            if(!user){
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no existe'
                })
            }
            user.password = password;
            user.uuid = generateToken();
            await user.save();
            return res.status(200).json({
                ok: true,
                msg: 'Contraseña actualizada'
            })
        } catch(error){
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar la contraseña'
            })
        } 
    
    },
    googleLogin:async (req,res) =>{
        let user = await User.findOne({email: req.body.email});

        if(user){
            if(user.google){
                return res.status(200).json({
                    ok: true,
                    msg: 'Usuario logueado',
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
            }
            return res.status(400).json({
                ok: false,
                msg: 'No es una cuenta de Google'
            })
        }
        const data = {
            firstName:req.body.displayName?.split(' ')[0],
            lastName:req.body.displayName?.split(' ')[1],
            phone: req.body.phoneNumber && String(req.body.phoneNumber),
            username:req.body.email?.split('@')[0],
            email: req.body.email,
            password: generateToken(),
            google: true,
            avatar: req.body.photoURL,
            confirmed:true,
            uuid: generateToken(),
        }
        user = new User(data);

        await user.save();

        return res.status(200).json({
            ok: true,
            msg: 'Usuario logueado',
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
    },
    async getConstellators(req,res){
        const constellators = await User.find({constellator:true})
        /* const purchasesOfConstellators = []; */
        if(constellators.length === 0){
            return res.status(200).json({
                ok: true,
                msg: 'No hay consteladores',
                constellators: []
            })
        }
        /* constellators.forEach(async (user)=>{ 
            let purchases = await Purchase.find({
                user_id: user._id,
                inscriptionModel: REF.MODULE
            })
            .populate('inscriptionModel')
            .populate('user_id');

            purchasesOfConstellators = [...purchasesOfConstellators, ...purchases]
        }) */
        return res.status(200).json({
            ok: true,
            msg: 'Consteladores',
            constellators,
        })

    }
}