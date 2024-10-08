const Blog = require('../models/Blog');

module.exports = {
    getAll: function(req,res){
        Blog.find({}).sort({updatedAt: -1}) //ordena de los últimos a los primeros
        .then(articles =>{
            if(articles.length != 0) return res.status(200).json({articles})
            return res.status(204).send({message:'No hay artículos cargados'})
        })
        .catch(err => res.status(500).send({err}))
    },
    create:function(req,res){
        const data ={
            title: req.body.title,
            img: (req.files[0])?req.files[0].filename: "",
            paragraph: req.body.paragraph
        };
        const newArticle = new Blog(data);
        newArticle.save()
        .then(article => res.status(201).send({article}))
        .catch(err => res.status(500).send({err}));
    },
    show: function(req,res){
        let idArticle = req.params._id

        Blog.findById(idArticle).exec((err, article) =>{
            if(err) return res.status(500).send({message:'Error del servidor'})

            if(article){
                return res.status(200).send({article})
            }else{
                return res.status(404).send({message:'Esta nota no existe'})
            }
        })
    },
    update: async function(req,res){
        let idArticle = req.params._id;
        let image = req.files[0] ? req.files[0].filename : req.body.img;
        const article = await Blog.findById(idArticle)
        // if(article.img != image && article.img != ""){
        //     deleteFile(article.img)
        // }
        const data ={
            title: req.body.title,
            img: image,
            paragraph: req.body.paragraph
        };
        Blog.findByIdAndUpdate(idArticle,data,{new:true},(err, articleUpdate)=>{
            if(err) {console.log(err)
                return res.status(500).send({message:'Error en el servidor'})
            }
            if(articleUpdate){
                return res.status(200).send({article: articleUpdate})
            }else{
                return res.status(404).send({message:'La nota no existe'})
            }
        })
    },
    remove: async function(req,res){
        let idArticle = req.params._id;
        const article = await Blog.findById(idArticle)
        if(article.img && article.img != ""){
            deleteFile(article.img)
        }

        Blog.findByIdAndRemove(idArticle, (err, articleRemove)=>{
            if(err) return res.status(500).send({message:'Error en el servidor'})
            if(articleRemove){
                res.status(200).send({article:articleRemove})
            }else{
                return res.status(404).send({message: 'No existe esta nota'})
            }
        })
    },
    //middleware para buscar notas
    find: function(req,res, next){ 
        Blog.find({_id: req.params._id})
        .then(article => {
            if(!article.length) return next();
            req.body.article = article;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}