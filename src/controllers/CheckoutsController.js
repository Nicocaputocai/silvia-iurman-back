const Purchase = require('../models/Purchase');
const {checkoutMP} = require('../helpers')

module.exports = {
    mercadoPago: async(req,res) =>{
        try {
            const init_url = await checkoutMP(req.body);
            return res.status(200).json({
                ok: true,
                init_url
            })
        } catch (error) {
            if(error.status !== 500){
                return res.status(error.status).json({
                    ok: false,
                    msg: error.message || 'upss, hubo un error'
                })
            }
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
        }
    },
    paypal: async(req,res) =>{
        try {
            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                country: req.body.country,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                phone: req.body.phone,
                wayToPay: req.body.wayToPay,
                inscription: req.body.inscription,
                pay: req.body.pay,
                finish: req.body.finish
            }

            const purchase = new Purchase(data);
            const purchaseStore = await purchase.save();

            return res.status(201).json({
                ok: true,
                msg: 'Compra registrada',
                purchase: purchaseStore
            })
        } catch (error) {
            if(error.status !== 500){
                return res.status(error.status).json({
                    ok: false,
                    msg: error.message || 'upss, hubo un error'
                })
            }
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
        }
    }
}