const { testEmail } = require("../helpers/sendMails")

module.exports = {
    sendEmail: async (req,res)=>{
        const response = await testEmail(req.body)
        return res.status(200).json({
            ok: true,
            body: req.body,
            response
        })
    }
}