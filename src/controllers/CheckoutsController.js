const Purchase = require('../models/Purchase');
const {checkoutMP, checkoutPaypal, paypalToken} = require('../helpers');
const mercadopago = require('mercadopago');
const { default: axios } = require('axios');
const { getOrderPaypal } = require('../helpers/paypal');

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
    captureMercadoPago: async(req,res) =>{
        const {id} = req.body;
        try {
            const {body} = await mercadopago.payment.get(id);
            
            if(body.status !== 'approved'){
                return res.status(400).json({
                    ok: false,
                    msg: 'Pago cancelado'
                })
            }
            
                //aca va la logica para guardar la compra y el curso en la base de datos
                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado'
                })
            } catch (error) {
                if(error.status !== 500){
                    return res.status(error.status).json({
                        ok: false,
                        msg: error.message || 'upss, hubo un error'
                    })
                }
                console.log(error);
            }
            
    },
    paypal: async(req,res) =>{
        try {
            const link = await checkoutPaypal(req.body);
            return res.status(200).json({
                link
            })
        } catch (error) {
            return res.status(500).json({
                error: error.response
            })
        }
    },
    capturePayPal: async(req,res) =>{

        const data = await getOrderPaypal(req.body.id);

        if(!data){
            return res.status(400).json({
                ok: false,
                msg: 'Pago cancelado'
            })
        }

        if(data.status === 'VOIDED'){
            return res.status(400).json({
                ok: false,
                msg: 'Pago cancelado'
            })
        }

        if(data.status === 'COMPLETED'){
            return res.status(200).json({
                ok: true,
                msg: 'Pago aprobado'
            })
        }
    }
}