const Course = require('../models/Course')

module.exports = {
    getAll: function(req,res){
        Course.find({}).sort({updatedAt: -1}) //ordena de los últimos a los primeros
        .then(courses =>{
            if(courses.length != 0) return res.status(200).json({courses})
            return res.status(204).send({message:'No hay cursos cargados'})
        })
        .catch(err => res.status(500))
    },
    create:function(req,res){
        const data= {
            name: req.body.name,
            day: req.body.name,
            price: req.body.price
        };
        const newCourse = new Course(data);
        newCourse.save()
        .then(course =>res.status(201).send({course}))
        .catch(err =>res.status(500).send({err}))
    },
    show: function(req,res){
        let courses = req.body.courses;
        if(req.body.err) return res.status(500).send({err})
        if(req.body.courses) return res.status(200).send({courses})
        return res.status(404).send({message:'El curso no existe'})
    },
    update: function(req,res){
        let idCourse = req.params._id;
        const data= {
            day: req.body.name,
            price: req.body.price
        };
        Course.findByIdAndUpdate(idCourse, data, {new:true},(err, courseUpdated) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'})
            if(courseUpdate){
                return res.status(200).send({courseUpdated}) // si no funciona probar course: courseUpdated
            }else{
                return res.status(404).send({message:'El curso no existe'})
            }
        })
    },
    remove: function(req,res){
        let idCourse = req.params._id;
        Course.findByIdAndRemove(idCourse, (err, courseRemoved) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'})
            if(courseRemoved){
                return res.status(200).send({courseRemoved}) //si no funciona probar course: courseRemoved
            }else{
                return res.status(404).send({message: 'No existe este curso'})
            }
        })
    },
    //middleware para buscar cursos
    find: function(req,res, next){ 
        Course.find({_id: req.params._id})
        .then(courses => {
            if(!courses.length) return next();
            req.body.courses = courses;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}