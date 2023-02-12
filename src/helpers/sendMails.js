// const nodemailer = require('nodemailer')

// //PROBAR sendinblue https://es.sendinblue.com/
// const transport = nodemailer.createTransport({
//     host: process.env.HOST_MAIL,
//     port: process.env.PORT_MAIL,
//     auth: {
//       user: process.env.USER_MAIL,
//       pass: process.env.PASS_MAIL
//     }
//   });

// module.exports={
//     confirmRegister: async (data) =>{
//         const {name, email, token} = data
//         // console.log(data);

//         try {
//             const infoMail = await transport.sendMail({
//                 from: "The Division Code",
//                 to: email,
//                 subject: "confirma tu cuenta",
//                 text: "confirma tu cuenta proyect manager",
//                 html: `
//                 <p> Hola ${name}, para confirmar tu cuenta hacé click en el siguiente enlace</p>
//                 <a href="${process.env.URL_FRONT}/confirm/${token}">Confirmá tu cuenta</a>
//                 `
//             })
//         console.log(infoMail);
//         } catch (error) {
//             console.log(error);
//         }
//     },
//     forgotPassword: async (data) =>{
//         const {name, email, token} = data
        
//         // console.log(data);
//         try {
//             const infoMail = await transport.sendMail({
//                 from: "The Division Code",
//                 to: email,
//                 subject: "reestablecé tu contaseña",
//                 text: "reestablecé tu contraseña en  proyect manager",
//                 html: `
//                 <p> Hola ${name}, para reestablecer tu contraseña hacé click en el siguiente enlace</p>
//                 <a href="${process.env.URL_FRONT}/recover-password/${token}">Confirmá tu cuenta</a>
//                 `
//             })
//         console.log(infoMail);
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }