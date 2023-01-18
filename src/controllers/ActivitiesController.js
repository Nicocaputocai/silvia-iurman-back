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
        const data = {
            day: req.body.day,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            img: (req.files[0])?req.files[0].filename: "",
            modality: req.body.modality,
            city: req.body.city,
            important: req.body.important,
        };
        const newActiviy = new Activity(data);
        newActiviy.save()
        .then(activity => res.status(201).send({activity}))
        .catch(err => res.status(500).send({err}));
    },
    show: function(req,res){
        let idActivity = req.params._id;
        Activity.findById(idActivity).exec((err, activity) =>{
            if(err) return res.status(500).send({message: 'Error en el servidor'})

            if(activity){
                return res.status(200).send(activity)
            }else{
                return res.status(404).send({message:'Esta nota no existe'})
            }
        })
    },
    update: function(req,res){
        let idActivity = req.params._id;
        let image = req.files[0] ? req.files[0].filename : req.body.img;
        const data ={
            day: req.body.day,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            img: image,
            modality: req.body.modality,
            city: req.body.city,
            important: req.body.important,
            archived: req.body.archived
        };

        Activity.findByIdAndUpdate(idActivity, data, {new:true},(err, activityUpdate) =>{
            if(err){
                console.log(err)
                return res.status(500).send({message:'error en el servidor'})
            }

            if(activityUpdate){
                return res.status(200).send({activity: activityUpdate})
            }else{
                return res.status(404).send({message: 'La actividad no existe'})
            }
        });
    },
    remove: function(req,res){
        let idActivity = req.params._id
        Activity.findByIdAndRemove(idActivity,(err, activityRemoved) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'})

            if(activityRemoved){
                return res.status(200).send({activity: activityRemoved})
            }else{
                return res.status(400).send({message:'No existe esta actividad'})
            }
        })
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