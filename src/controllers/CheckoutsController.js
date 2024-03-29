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
const { emailInscriptionAdmin, emailInscriptionUser, transferPayUser, transferPayAdmin } = require('../helpers/sendMails');

module.exports = {
    mercadoPago: async(req,res) =>{
        let {product, idPurchase, type} = req.body;
        /* console.log(req.body)
        if (typeof idPurchase === 'string') {
            idPurchase = mongoose.Types.ObjectId(idPurchase.replace(/"/g, ''));
          } else {
            return res.status(400).json({
              ok: false,
              msg: 'El valor de idPurchase no es un string',
            });
          } */
        try {
            const user = await User.findById(req.user._id);
            const module = await Module.findById(idPurchase);

            if(user.activity.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a esta actividad'
                })
            }

            if(user.modules.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este modulo'
                })
            }

            /* const existingModule = user.modules.find(async moduleId => {
                const purchasedModule = await Module.findById(moduleId);
                return purchasedModule && purchasedModule.id_module === module.id_module;
            });
            if (existingModule) {
                return res.status(400).json({
                  ok: false,
                  msg: 'No puedes comprar el mismo módulo en directo y grabado'
                });
            } */
            if(type === REF.MODULE){
                const existingModule = await Module.findOne({
                    id_module: module.id_module,
                    _id: { $in: user.modules }
                  });
                  
                  if (existingModule) {
                    return res.status(400).json({
                      ok: false,
                      msg: 'No puedes comprar el mismo módulo en directo y grabado'
                    });
                  }
            }

            if(user.courses.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este Taller'
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
                let finishedModules = 0;
                const purchasesOfUser = await Purchase.find(
                    {
                        user_id: user._id,
                        inscriptionModel: REF.MODULE,
                    });
                
                purchasesOfUser.forEach(purchase => {
                    if(purchase.finish){
                        finishedModules++;
                    }
                });
                if(finishedModules === 16){
                    user.constellator = true;
                }
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
        let {product, idPurchase, type} = req.body;

        /* if (typeof idPurchase === 'string') {
            idPurchase = mongoose.Types.ObjectId(idPurchase.replace(/"/g, ''));
          } else {
            return res.status(400).json({
              ok: false,
              msg: 'El valor de idPurchase no es un string',
            });
          } */
  
        try {
            const user = await User.findById(req.user._id);
            const module = await Module.findById(idPurchase);

            if(user.activity.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a esta actividad'
                })
            }

            if(user.modules.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este modulo'
                })
            }
            if(type === REF.MODULE){

                const existingModule = await Module.findOne({
                    id_module: module.id_module,
                    _id: { $in: user.modules }
                  });
                  
                  if (existingModule) {
                    return res.status(400).json({
                      ok: false,
                      msg: 'No puedes comprar el mismo módulo en directo y grabado'
                    });
                  }
            }
              
            if(user.courses.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este Taller'
                })
            }

            const link = await checkoutPaypal(product);
            return res.status(200).json({
                link
            })
        } catch (error) {
            console.log(error);
            if(error.status !== 500){
                return res.status(400).json({
                    ok: false,
                    error: error.message || 'upss, hubo un error'
                })
            }
            return res.status(500).json({
                ok: false,
                error: 'Contacte al administrador'
            })
        }
        /* try {
            const link = await checkoutPaypal(req.body);
            return res.status(200).json({
                link
            })
        } catch (error) {
            return res.status(500).json({
                error: error.response
            })
        } */
    },
    capturePayPal: async(req,res) =>{

        const {id, idPurchase, type} = req.body;

        try {
            
            const response = await getOrderPaypal(id);
            
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
            
            if (response.status !== 'COMPLETED') {
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
                let finishedModules = 0;
                const purchasesOfUser = await Purchase.find(
                    {
                        user_id: user._id,
                        inscriptionModel: REF.MODULE,
                    });
                
                purchasesOfUser.forEach(purchase => {
                    if(purchase.finish){
                        finishedModules++;
                    }
                });
                if(finishedModules === 16){
                    user.constellator = true;
                }
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
    captureTransfer: async(req,res) =>{
        const { idPurchase, type, pricePurchase } = req.body;

        /* if (typeof idPurchase === 'string') {
            idPurchase = mongoose.Types.ObjectId(idPurchase.replace(/"/g, ''));
          } else {
            return res.status(400).json({
              ok: false,
              msg: 'El valor de idPurchase no es un string',
            });
          } */
  
        try {
            const user = await User.findById(req.user._id);
            const module = await Module.findById(idPurchase);

            if(user.activity.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a esta actividad'
                })
            }

            if(user.modules.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este modulo'
                })
            }

            if(type === REF.MODULE){
                const existingModule = await Module.findOne({
                    id_module: module.id_module,
                    _id: { $in: user.modules }
                  });
                  
                  if (existingModule) {
                    return res.status(400).json({
                      ok: false,
                      msg: 'No puedes comprar el mismo módulo en directo y grabado'
                    });
                  }
            }

              
            if(user.courses.includes(idPurchase)){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esta inscripto a este Taller'
                })
            }

            const purchase = new Purchase({
                user_id: user._id,
                wayToPay: TYPETOPAY.TRANS,
                inscription: idPurchase,
                inscriptionModel: type,
                pay: false,
            });

            await purchase.save();

            await transferPayUser({
                email: user.email,
                purchase: purchase._id,
                price: pricePurchase,
            })

            await transferPayAdmin({
                email: user.email,
                purchase: purchase._id,
                price: pricePurchase,
            })

            return res.status(200).json({
                ok: true,
                msg: 'Se ha enviado la información de pago a tu correo!',
                purchase,
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: 'Contacte al administrador'
            })
        }
    },
    confirmTransfer: async(req,res) =>{

            const {id} = req.body
    
            try {

                const purchase = await Purchase.findById(id);
                if(!purchase){
                    return res.status(400).json({
                        ok: false,
                        msg: 'Compra no encontrada'
                    })
                }
                
                const user = await User.findById(purchase.user_id)
                .populate('activity')
                .populate('courses')
                .populate('modules');
    
                if (!user) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario no encontrado'
                    })
                }
                
                if(purchase.inscriptionModel === REF.ACTIVITY) {
                    user.activity = [...user.activity, purchase.inscription];
                    await user.save();
                    purchase.pay = true;
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
                } else if (purchase.inscriptionModel === REF.MODULE){
                    user.modules = [...user.modules, purchase.inscription];
                    let finishedModules = 0;
                    const purchasesOfUser = await Purchase.find(
                        {
                            user_id: user._id,
                            inscriptionModel: REF.MODULE,
                        });
                    
                    purchasesOfUser.forEach(purchase => {
                        if(purchase.finish){
                            finishedModules++;
                        }
                    });
                    if(finishedModules === 16){
                        user.constellator = true;
                    }
                    await user.save();
                    purchase.pay = true;
                    const module = await Module.findById(purchase.inscription)
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
                } else if (purchase.inscriptionModel === REF.COURSE){
                    user.courses = [...user.courses, purchase.inscription];
                    await user.save();
                    purchase.pay = true;
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
    }
}