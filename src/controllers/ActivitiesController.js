const { deleteFile } = require('../helpers');
const Activity = require('../models/Activity');

module.exports = {
    getAll: function(req,res){
        Activity.find({}).sort({day: 1}) //ordena de los últimos a los primeros
        .then(activities =>{
            if(activities.length != 0) return res.status(200).json({activities})
            return res.status(204).send({message:'No hay actividades cargadas'})
        })
        .catch(err => res.status(500))
    },
    create:function(req,res){
        const data = {
            ...req.body,
            img: (req.files[0])?req.files[0].filename: "",
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
                return res.status(200).send({activity})
            }else{
                return res.status(404).send({message:'Esta nota no existe'})
            }
        })
    },
    update: async function(req,res){
        let idActivity = req.params._id;
        let image = req.files[0] ? req.files[0].filename : req.body.img;
        const activity = await Activity.findById(idActivity)
        if(activity.img != image && activity.img != ""){
            deleteFile(activity.img)
        }
        const data ={
            day: req.body.day,
            title: req.body.title,
            description: req.body.description,
            pricePesos: req.body.pricePesos,
            priceDolar: req.body.priceDolar,
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
    remove: async function(req,res){
        let idActivity = req.params._id
        const activity = await Activity.findById(idActivity)
        if(activity.img && activity.img != ""){
            deleteFile(activity.img)
        }
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
        .then(activity => {
            if(!activity.length) return next();
            req.body.activity = activity;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}