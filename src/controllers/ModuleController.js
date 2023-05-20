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
            title:req.body.title,
            typeModule:req.body.type,
            link_intro:req.body.link_intro,
            link:req.body.link,
            date:req.body.date,
            enabled:req.body.enabled,
            open:req.body.open,
            pricePesos:req.body.pricePesos,
            priceAnticipedPesos:req.body.priceAnticipedPesos,
            priceDolar:req.body.priceDolar,
            priceAnticipedPesos: req.body.priceAnticipedPesos
        }

        const newModule = new Module(data);
        await newModule.save()
        return res.status(201).json({module:newModule});

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
}