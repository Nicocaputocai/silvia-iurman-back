const nodemailer = require('nodemailer')

// //PROBAR sendinblue https://es.sendinblue.com/
const transport = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    }
});

module.exports = {
    testEmail: async (data) => {
        const { name, email } = data
        const response = await transport.sendMail({
            from: "Silvia Iurman",
            to: email,
            subject: "test",
            text: "test",
            html: `
                <p> Hola ${name}, este es un test</p>
                    `
        })
        return response
    },
    confirmRegister: async (data) => {
        const { name, email, uuid } = data
        console.log(data);

        try {
            const infoMail = await transport.sendMail({
                from: "Silvia Iurman",
                to: email,
                subject: "confirma tu cuenta",
                text: "confirma tu cuenta",
                html: `
                <p> Hola ${name}, para confirmar tu cuenta hacé click en el siguiente enlace</p>
                <a href="${process.env.API_FRONTEND}/confirm/${uuid}">Confirmá tu cuenta</a>
                `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    },
    forgotPassword: async (data) => {
        const { name, email, uuid } = data
        try {
            const infoMail = await transport.sendMail({
                from: `Silvia Iurman <${process.env.USER_MAIL}>`,
                to: email,
                subject: "Reestablecé tu contaseña",
                text: "reestablecé tu contraseña",
                html: `
                <p>Hola ${name},</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <a href="${process.env.API_FRONTEND}/recover-password/${uuid}">Restablecer contraseña</a>
                `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    },
    emailInscriptionUser: async (data) => {
        const { name, email, purchase } = data
        try {
            const infoMail = await transport.sendMail({
                from: "Silvia Iurman",
                to: email,
                subject: "Inscripción exitosa",
                text: "Inscripción exitosa",
                html: `
                <p> Hola ${name}, la inscripción a ${purchase} se realizó con éxito</p>
                <p>Hace clic <a href="${process.env.API_FRONTEND}/login">aqui</a> para acceder a tu cuenta!</p>
                `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    },
    emailInscriptionAdmin: async (data) => {
        const { email, purchase } = data
        try {
            const infoMail = await transport.sendMail({
                from: "Silvia Iurman",
                to: process.env.MAIL_ADMIN,
                subject: "Inscripción exitosa",
                text: "Inscripción exitosa",
                html: `
                <p> La inscripción del usuario ${email} al curso ${purchase} se realizó con éxito</p>
                `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    },
    transferPayUser: async (data) => {
        
        const { email, purchase, price } = data
        try {
            const infoMail = await transport.sendMail({
                from: "Silvia Iurman",
                to: email,
                subject: "Inscripción pendiente",
                text: "Inscripción pendiente",
                html: `
                <p>Estimado/a ${email},</p>
                    <p>Gracias por tu compra. A continuación, te proporcionamos los detalles para realizar una transferencia bancaria:</p>
                    <ul>
                        <li>Monto: $${price}</li>
                        <li>BANCO: Galicia</li>
                        <li>CBU: 1234567890123456789012</li>
                        <li>ALIAS: BOLDO.TAPIZ.ARROZ</li>
                        <li>CTA: 4005129-2 234-2</li>
                        <li>Titular: Alejandro Paredes</li>
                        <li>CUIL: 20164026230</li>
                    </ul>
                    <p>Por favor, realiza la transferencia a la cuenta indicada y asegúrate de incluir tu ID de compra (${purchase}) en el concepto de la transferencia.</p>
                    <p>Una vez que hayamos recibido la transferencia, procesaremos tu inscripción y te enviaremos más detalles.</p>
                    <p>¡Gracias por tu atención!</p>
                `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    },
    transferPayAdmin: async (data) => {
        const { email, purchase, price } = data
        try {
            const infoMail = await transport.sendMail({
                from: "Silvia Iurman",
                to: process.env.MAIL_ADMIN,
                subject: "Inscripción pendiente",
                text: "Inscripción pendiente",
                html:`
                    <p>Estimado administrador,</p>
                    <p>Se ha recibido un pago por parte del usuario ${email}.</p>
                    <p>Detalles del pago:</p>
                    <ul>
                        <li>Usuario: ${email}</li>
                        <li>Monto: ${price}</li>
                        <li>Recurso: ${purchase}</li>
                    </ul>
                    <p>Por favor, verifica el pago y realiza las acciones necesarias para completar la inscripción.</p>
                    <p>¡Gracias por tu atención!</p>
                    `
            })
            console.log(infoMail);
        } catch (error) {
            console.log(error);
        }
    }
}