const Admin = require('../models/Admin');
const createError = require('http-errors');
const errorResponse = require('../helpers/errorResponse')
const JWTGenerator = require('../helpers/JWTGenerator')

module.exports = {
    getAll: async(req,res) =>{
        try {
            return res.status(200).json({
            ok: true,
            msg: 'perfil de usuario',
            admin: req.admin
        })
        } catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'upss, hubo un error profile'
            })
        }
    },
    registerAdmin: async(req,res) =>{
        try {
            const {username, password} = req.body;

            if([username,password].includes("")){
                throw createError(400,"Todos los campos son obligatorios")
            };
            let user = await Admin.findOne({username});
            if(user){
                throw createError(400,"Usuario existente")
            };

            user = new Admin(req.body);
            
            const userAdminStore = await user.save();

            return res.status(201).json({
                ok : true,
                msg :'Usuario Registrado',
                data: userAdminStore
            })

        } catch (error) {
            return errorResponse(res,error, "Error en el REGISTER")
        }
    },

    loginAdmin: async(req,res) =>{
        const {username, password} = req.body;

        try {
            if([username,password].includes("")){
                throw createError(400,"Todos los campos son obligatorios")
            };

            const user = await Admin.findOne({
                username
            });  
            
            if(!user){
                throw createError(403,"Credenciales inválidas")
            };

            if (!await user.checkedPassword(password)) {
                throw createError(403,"Credenciales inválidas")
            }

            return res.status(200).json({
                ok: true,
                msg: 'usuario logueado',
                user : {
                    name : user.username,
                    _id : user._id,
                },
                token : JWTGenerator({
                    id: user._id
                })
            });

        } catch (error) {
            return errorResponse(res,error, "Error en el login")
        }
    }
}