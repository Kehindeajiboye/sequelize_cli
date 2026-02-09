require('dotenv').config()
const axios = require('axios')
const { request_id } = require('../utils/utils')


const mtnAirtimePurchase = async (data) => {
    try {
        const response = await axios.post(
            'https://sandbox.vtpass.com/api/pay',
            {
                request_id: request_id(),
                serviceID: data.serviceID,
                amount: parseInt(data.amount),
                phone: data.phone
            },
            {
                headers: {
                    "api-key": process.env.VTPASS_API_KEY,
                    "secret-key": process.env.VTPASS_SECRET_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data
    } catch (error) {
        throw error
        console.log('error', error)
    }
}

const ikejaElectricBillVerify = async (data) => {
    try {
        const response = await axios.post(
            "https://sandbox.vtpass.com/api/merchant-verify",
            {
                billersCode: data.billersCode,
                serviceID: data.serviceID,
                type: data.type
            },
            {
                headers: {
                    "api-key": process.env.VTPASS_API_KEY,
                    "secret-key": process.env.VTPASS_SECRET_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data
    } catch (error) {
        console.log('error', error)
        throw error
    }
}

const ikejaElectricBillPayment = async (data) => {
    try {
        const response = await axios.post(
            " https://sandbox.vtpass.com/api/pay",
            {
                request_id: request_id(),
                serviceID: data.serviceID,
                billersCode: data.billersCode,
                variation_code: data.variation_code,
                amount: parseInt(data.amount),
                phone: data.phone
            },
            {
                headers: {
                    "api-key": process.env.VTPASS_API_KEY,
                    "secret-key": process.env.VTPASS_SECRET_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data
    } catch (error) {
        console.log('error', error)
        throw error
    }
}


module.exports = {
    mtnAirtimePurchase,
    ikejaElectricBillVerify,
    ikejaElectricBillPayment
}
