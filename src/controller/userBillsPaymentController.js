const { mtnAirtimePurchase, ikejaElectricBillVerify, ikejaElectricBillPayment } = require("../services/vtPassService")
const { users, wallets, otp, transactions } = require('../../models')
const { v4 : uuidv4 } = require ('uuid');
const { initializePayment, verifyPayment } = require("../services/paystackServices");

const startFundWallet = async (req, res) => {
    const { customer_id } = req.params
    const { amount } = req.body
    try {
        const user = await users.findOne({ where: { id: customer_id } })
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        data = {
            email: user.email,
            amount
        }
        const initializePaymentResponse = initializePayment(data)
        if (!initializePaymentResponse.data.status) {
            return res.status(400).json({
                status: false,
                message: "Unable to initialize payment"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Payment initialized successfully",
            data: initializePaymentResponse.data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const completeFundWallet = async (req, res) => {
    const { reference } = req.params
    try {
        const checkIfReferenceExists = await transactions.findOne({ where: { transaction_reference: reference } })
        if (checkIfReferenceExists) {
            return res.status(400).json({
                status: false,
                message: "Transaction already processed"
            })
        }

        const verifyPaymentResponse = await verifyPayment(reference)
        if (!verifyPaymentResponse.data.status) {
            return res.status(400).json({
                status: false,
                message: "Payment verification failed",
                error: verifyPaymentResponse.data
            })
        }

        const user = await users.findOne({ where: { email: verifyPaymentResponse.data.data.customer.email } })

        await wallets.increment({ balance: verifyPaymentResponse.data.data.amount / 100 },
            { where: { customer_id: user.customer_id } })

        await transactions.create({
            transaction_id: uuidv4(),
            transaction_reference: reference,
            customer_id: user.customer_id,
            amount: verifyPaymentResponse.data.data.amount / 100
        })

        return res.status(200).json({
            status: true,
            message: "Wallet funded successfully",
            data: verifyPaymentResponse.data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const mtnAirtimePurchaseController = async (req, res) => {
    const { serviceID, amount, phone } = req.body
    try {
        const response = await mtnAirtimePurchase(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to initialize transaction"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Transaction successful",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const ikejaElectricBillVerifyController = async (req, res) => {
    const { billersCode, serviceID, type } = req.body
    try {
        const response = await ikejaElectricBillVerify(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to verify biller"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Biller verified successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const ikejaElectricBillPaymentController = async (req, res) => {
    const { serviceID, billersCode, variation_code, amount, phone, type } = req.body
    try {
        const response = await ikejaElectricBillPayment(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to process payment"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Payment processed successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    mtnAirtimePurchaseController,
    ikejaElectricBillVerifyController,
    ikejaElectricBillPaymentController,
    startFundWallet,
    completeFundWallet
}