const Module = require('../models/Module');

module.exports = {
    getAll: async (req,res)=>{
        const {type} = req.query;
        if(type){
            const modules = await Module.find({typeModule:type});
            return res.status(200).json({modules});
        }
        const modules = await Module.find();
        res.status(200).json({modules});
    },
    getById: async (req,res)=>{
        const {id} = req.params;
        const module = await Module.findById(id);
        res.status(200).json({module});
    },
    create:async(req,res)=>{
        const data = {
            title: req.body.title,
            typeModule :req.body.type,
            link_intro: req.body.link_intro,
            link: req.body.link,
            date: req.body.date,
            enabled: req.body.enabled,
            open: req.body.open,
            pricePesos: req.body.pricePesos,
            priceAnticipedPesos: req.body.priceAnticipedPesos,
            priceDolar: req.body.priceDolar,
            priceAnticipedPesos: req.body.priceAnticipedPesos
        }

        const newModule = new Module(data);
        await newModule.save()
        return res.status(201).json({module:newModule});

    },
    update: async function(req,res){
        console.log(req.body);
        // let idModule = req.params._id;
        let findModule = await Module.findById({_id: req.params._id});
        if(!findModule){
            return res.status(404).send({message:'El módulo no existe'})
        }
            const data= {
                link_intro:req.body.link_intro,
                link:req.body.link,
                date:req.body.date,
                enabled:req.body.enabled,
                open:req.body.open,
                pricePesos:req.body.pricePesos,
                priceDolar:req.body.priceDolar,
            };
            await findModule.updateOne(data, {new:true},(err, moduleUpdated) =>{
                if(err) return res.status(500).send({message:'Error en el servidor'})
                if(moduleUpdated){
                    return res.status(200).send({moduleUpdated})
                }else{
                    return res.status(404).send({message:'El módulo no existe'})
                }
            })
        
    },
    delete: async (req,res)=>{
        const {id} = req.params;
        await Module.findByIdAndDelete(id);
        return res.status(200).json({message:'Module deleted'});
    },
    createAll:async(req,res)=>{
        const data = req.body;
        const modules = await Module.insertMany(data);
        return res.status(201).json({modules});
    },
    deleteAll:async(req,res)=>{
        await Module.deleteMany();
        return res.status(200).json({message:'Modules deleted'});
    },
     //middleware para buscar cursos
     find: function(req,res, next){ 
        Module.find({_id: req.params._id})
        .then(modulo => {
            if(!modulo.length) return next();
            req.body.modulo = modulo;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    },
}