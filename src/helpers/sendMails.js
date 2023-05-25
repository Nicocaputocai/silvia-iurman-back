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
            from: "The Division Code",
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
                from: "The Division Code",
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
                from: "The Division Code",
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
    }
}