const Purchase = require('../models/Purchase')

module.exports = {
    getAll: function(req,res){
        Purchase.find({}).sort({updatedAt: -1}) //ordena de los últimos a los primeros
        .then(purchases =>{
            if(purchases.length != 0) return res.status(200).json({purchases})
            return res.status(204).send({message:'No hay cursos comprados aún'})
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
        Purchase.find({_id: req.params._id})
        .then(purchases => {
            if(!purchases.length) return next();
            req.body.purchases = purchases;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}