require('dotenv').config()
const axios = require('axios')


const initializePayment = async (data) => {
    return axios({
        method: 'POST',
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        data: {
            email: data.email,
            amount: parseInt(data.amount) * 100
        }
    })
}

const verifyPayment = async (reference) => {
    return axios({
        method: 'GET',
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
}


module.exports = {
    initializePayment,
    verifyPayment
}