const Activity = require('../models/Activity')

module.exports = {
    getAll: function(req,res){
        Activity.find({}).sort({updatedAt: -1}) //ordena de los últimos a los primeros
        .then(activities =>{
            if(activities.length != 0) return res.status(200).json({activities})
            return res.status(204).send({message:'No hay actividades cargadas'})
        })
        .catch(err => res.status(500))
    },
    create:function(req,res){

    },
    show: function(req,res){

    },
    update: function(req,res){

    },
    remove: function(req,res){

    },
    //middleware para buscar cursos
    find: function(req,res, next){ 
        Activity.find({_id: req.params._id})
        .then(activities => {
            if(!activities.length) return next();
            req.body.activities = activities;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}