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
            day: req.body.day,
            pricePesos: req.body.pricePesos,
            priceAnticipedPesos: req.body.priceAnticipedPesos,
            priceDolar: req.body.priceDolar,
            linkMP: req.body.linkMP,
            linkPP: req.body.linkPP
        };
        const newCourse = new Course(data);
        newCourse.save()
        .then(course =>res.status(201).send({course}))
        .catch(err =>res.status(500).send({err}))
    },
    show: function(req,res){
        let course = req.body.course;
        if(req.body.err) return res.status(500).send({err})
        if(req.body.course) return res.status(200).send({course})
        return res.status(404).send({message:'El curso no existe'})
    },
    update: function(req,res){
        let idCourse = req.params.name;
        const data= {
            day: req.body.day,
            pricePesos: req.body.pricePesos,
            priceAnticipedPesos: req.body.priceAnticipedPesos,
            priceDolar: req.body.priceDolar,
            linkMP: req.body.linkMP,
            linkPP: req.body.linkPP
        };
        Course.findByIdAndUpdate(idCourse, data, {new:true},(err, courseUpdated) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'})
            if(courseUpdated){
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
        .then(course => {
            if(!course.length) return next();
            req.body.course = course;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    },
    findByName: function(req,res,next){
        Course.find({name: req.params.name})
        .then(course => {
            if(!course.length) return next();
            req.body.course = course;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}