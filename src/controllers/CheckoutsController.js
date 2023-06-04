const Purchase = require('../models/Purchase');
const Activity = require('../models/Activity');
const Module = require('../models/Module');
const Course = require('../models/Course');
const User = require('../models/User');
const {checkoutMP, checkoutPaypal} = require('../helpers');
const mercadopago = require('mercadopago');
const { getOrderPaypal } = require('../helpers/paypal');
const  mongoose  = require('mongoose');
const { TYPETOPAY, REF, TYPEMODULE } = require('../types/types');
const { emailInscriptionAdmin, emailInscriptionUser } = require('../helpers/sendMails');

module.exports = {
    mercadoPago: async(req,res) =>{
        let {product, idPurchase} = req.body;
        if (typeof idPurchase === 'string') {
            idPurchase = mongoose.Types.ObjectId(idPurchase.replace(/"/g, ''));
          } else {
            return res.status(400).json({
              ok: false,
              msg: 'El valor de idPurchase no es un string',
            });
          }
        try {
            const user = await User.findById(req.user._id);
            if(user.activity.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a esta actividad'
                })
            }

            if(user.modules.includes(idPurchase)){
                console.log('Ya esta inscripto a esta actividad');
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este modulo'
                })
            }

            if(user.courses.includes(idPurchase)){
                console.log('Ya esta inscripto a esta actividad');
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este modulo'
                })
            }

            const init_url = await checkoutMP(product);
            return res.status(200).json({
                ok: true,
                init_url
            })
        } catch (error) {
            console.log(error);
            if(error.status !== 500){
                return res.status(400).json({
                    ok: false,
                    msg: error.message || 'upss, hubo un error'
                })
            }
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
        }
    },
    captureMercadoPago: async (req, res) => {
        let { id, idPurchase, type } = req.body;
        try {
            
            const { body } = await mercadopago.payment.get(id);
            
            const user = await User.findById(req.user._id)
            .populate('activity')
            .populate('courses')
            .populate('modules');

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                })
            }
            
            if (body.status !== 'approved') {
                return res.status(400).json({
                    ok: false,
                    msg: 'Pago cancelado'
                })
            }
            
            if(type === REF.ACTIVITY) {
                user.activity = [...user.activity, idPurchase];
                await user.save();
                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: idPurchase,
                    inscriptionModel: REF.ACTIVITY,
                    pay: true,
                });

                await purchase.save();

                await emailInscriptionUser({
                    name:user.username,
                    email:user.email,
                    purchase: purchase._id,
                });

                await emailInscriptionAdmin({
                    email:user.email,
                    purchase: purchase._id,
                })

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase,
                })
            } else if (type === REF.MODULE){
                user.modules = [...user.modules, idPurchase];
                await user.save();
                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: idPurchase,
                    inscriptionModel: REF.MODULE,
                    pay: true,
                    
                });

                const module = await Module.findById(idPurchase)

                if(module.typeModule === TYPEMODULE.ASINCRONICO){
                    purchase.finish = true;
                }
                
                await purchase.save();

                await emailInscriptionUser({
                    name:user.username,
                    email:user.email,
                    purchase: purchase._id,
                });

                await emailInscriptionAdmin({
                    email:user.email,
                    purchase: purchase._id,
                })

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase,
                })
            } else if (type === REF.COURSE){
                user.courses = [...user.courses, idPurchase];
                await user.save();
                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: idPurchase,
                    inscriptionModel: REF.COURSE,
                    pay: true,
                });

                await purchase.save();

                await emailInscriptionUser({
                    name:user.username,
                    email:user.email,
                    purchase: purchase._id,
                });

                await emailInscriptionAdmin({
                    email:user.email,
                    purchase: purchase._id,
                })

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase,
                })
            } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Compra no encontrada'
                })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
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

        const {id, idPurchase} = req.body;

        const data = await getOrderPaypal(id);

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

            try {
                const user = await User.findById(req.user._id);

                if(!user){
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario no encontrado'
                    })
                }

            const [ activity, module, course ] = await Promise.all([
                Activity.findOne({ _id: idPurchase }),
                Module.findOne({ _id: idPurchase }),
                Course.findOne({ _id: idPurchase })
            ])

            if (activity) {
                user.activity = [...user.activity, activity._id];
                await user.save();

                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: 'actividad',
                    pay:true,
                });

                await purchase.save();

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase
                })
              } else if (module) {
                user.modules = [...user.activity, module._id];
                await user.save();

                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: 'modulo',
                    pay:true,
                });

                await purchase.save();

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase
                })
              } else if (course) {
                user.courses = [...user.activity, course._id];
                await user.save();

                const purchase = new Purchase({
                    user_id: user._id,
                    wayToPay: TYPETOPAY.MP,
                    inscription: 'course',
                    pay:true,
                });

                await purchase.save();

                return res.status(200).json({
                    ok: true,
                    msg: 'Pago aprobado',
                    purchase
                })
              } else {
                return res.status(400).json({
                    ok: false,
                    msg: 'Compra no encontrada'
                })
              }
            } catch (error) {
                console.log(error);
            }
        }
    }
}