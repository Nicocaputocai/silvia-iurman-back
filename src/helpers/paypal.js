const axios = require('axios');

const paypalToken = async () => {

    const auth = {
        username: process.env.CLIENT_ID_PP,
        password: process.env.SECRET_KEY_PP
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const {data} = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params , {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth,
    })

    return await data.access_token

}

const checkoutPaypal = async (items) => {

    const order = { 
        intent: "CAPTURE", 
        purchase_units: [ 
            { 
                reference_id: '123', 
                amount: { 
                    currency_code: "USD", 
                    value: '5' 
                },
            } 
        ], 
        application_context: {
            brand_name: 'Silvia Iurman',
            landing_page: 'LOGIN',
            user_action: 'PAY_NOW',
            return_url: `${process.env.API_FRONTEND}/checkout/payment`,
            cancel_url: `${process.env.API_FRONTEND}/checkout/payment`
        },
    }

    
    const token = await paypalToken();

    try {
        
        const result = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })

        return result.data.links[1].href
    } catch (error) {
    }
}

const getOrderPaypal = async (id) => {

    const token = await paypalToken();
    try {
        const {data} = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${id}/capture`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })

        return data;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    checkoutPaypal,
    paypalToken,
    getOrderPaypal
}