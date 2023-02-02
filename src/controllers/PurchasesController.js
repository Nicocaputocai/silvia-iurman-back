const Purchase = require('../models/Purchase')

module.exports = {
    getAll: function(req,res){
        Purchase.find({}).sort({updatedAt: -1}) //ordena de los últimos a los primeros
        .then(purchases =>{
            if(purchases.length != 0) return res.status(200).json({purchases})
            return res.status(204).send({message:'No hay cursos comprados aún'})
        })
        .catch(err => res.status(500).send(err))
    },
    create:function(req,res){
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            country: req.body.country,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            phone: req.body.phone,
            courseName: req.body.courseName,
            wayToPay: req.body.wayToPay,
            inscription: req.body.inscription,
        };
        const newPurchase = new Purchase(data);
        newPurchase.save()
        .then(purchase => res.status(201).send({purchase}))
        .catch(err => res.status(500).send({err}))
    },
    show: function(req,res){
        let purchase = req.body.purchase;
        if(req.body.err) return res.status(500).send({err});
        if(req.body.purchase){
            return res.status(200).send({purchase})
        }else{
            return res.status(404).send({message:'No existe esta compra'})
        }
    },
    update: function(req,res){
        let idPurchase = req.params._id;

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            country: req.body.country,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            phone: req.body.phone,
            courseName: req.body.courseName,
            wayToPay: req.body.wayToPay,
            pay: req.body.pay,
            finish: req.body.finish
        };
        Purchase.findByIdAndUpdate(idPurchase, data, {new:true}, (err, purchaseUpdated) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'});
            if(purchaseUpdated){
                return res.status(200).send({purchase: purchaseUpdated})
            }else{
                return res.status(404).send({message: 'La compra no existe'})
            };
        })
    },
    remove: function(req,res){
        let idPurchase = req.params._id

        Purchase.findByIdAndRemove(idPurchase, (err, purchaseRemoved) =>{
            if(err) return res.status(500).send({message:'Error en el servidor'})
            if(purchaseRemoved){
                return res.status(200).send({purchase: purchaseRemoved})
            }else{
                return res.status(404).send({message: 'No existe esta compra'})
            }
        })
    },
        //middleware para buscar cursos
    find: function(req,res, next){ 
        Purchase.find({_id: req.params._id})
        .then(purchase => {
            if(!purchase.length) return next();
            req.body.purchase = purchase;
            return next()
        })
        .catch(err => {
            req.body.err = err ;
            next();
        })
    }
}