const mercadopago = require('mercadopago')
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
})

const checkoutMP = async (item) => {
    try {
        const preference = {
            items: [
                {
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    picture_url: item.picture_url ? item.picture_url : 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
                    quantity: 1,
                    unit_price: item.price,
                    category_id: 'courses',
                    currency_id: 'ARS'
                }
            ],
            back_urls: {
                success: `${process.env.API_FRONTEND}/checkout/payment`,
                failure: `${process.env.API_FRONTEND}/checkout/payment`,
                pending: ''
            },
            auto_return: 'approved',
            binary_mode: true,
                
        }
        const response = await mercadopago.preferences.create(preference)
        return response.body.init_point
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    checkoutMP
}