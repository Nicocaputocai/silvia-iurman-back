const errorResponse = require("../helpers/errorResponse");
const {verify} = require('jsonwebtoken')
const User = require("../models/User");

module.exports = async(req,res,next) => {

    if(!req.headers.authorization){
        return res.status(401).json({message:'Se require un token para acceder a este recurso'});
    }
    const token = req.headers.authorization;
    try {
        const decoded = verify(token, process.env.TOKEN);
        if(!decoded){
            return res.status(401).json({message:'Token invalido'});
        }
        const user = await User.findById(decoded.id)
        .populate('activity')
        .populate('modules')
        .populate('courses');
        req.user = user
        next()
        
    } catch (error) {
        return errorResponse(res,error, "CHECK-TOKEN");
    }
}