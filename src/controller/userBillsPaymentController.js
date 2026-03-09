const { airtimePurchase, getAllServices, electricBillVerify, electricBillPayment, dataPurchase, waecRegistration, verifySmartcard, purchaseDstvSubscription, getVariationCode } = require("../services/vtPassService")
const { users, wallets, otp, transactions } = require('../../models')
const { v4: uuidv4 } = require('uuid');
const { initializePayment, verifyPayment } = require("../services/paystackServices");
const { checkCusBalance, debitCusWallet } = require("../utils/utils");


const getVtpassAllServices = async (req, res) => {
    try {
        const response = await getAllServices()
        if (response.response_description !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to fetch services"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Services fetched successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const startFundWallet = async (req, res) => {
    const { customer_id, email } = req.user
    const { amount } = req.body
    console.log("customer_id:", customer_id)
    try {
        const user = await users.findOne({ where: { customer_id } })
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
        const initializePaymentResponse = await initializePayment(data)
        // console.log("initializePaymentResponse:", initializePaymentResponse)
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
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassAirtimePurchase = async (req, res) => {
    const { serviceID, amount, phone } = req.body
    const { customer_id } = req.user
    try {
        await checkCusBalance(customer_id, amount)
        const response = await airtimePurchase(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to initialize transaction"
            })
        }
        await debitCusWallet(customer_id, amount)

        return res.status(200).json({
            status: true,
            message: "Transaction successful",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassElectricBillVerify = async (req, res) => {
    const { billersCode, serviceID, type } = req.body
    try {
        const response = await electricBillVerify(req.body)
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
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassElectricBillPayment = async (req, res) => {
    const { serviceID, billersCode, variation_code, amount, phone } = req.body
    const { customer_id } = req.user
    try {
        await checkCusBalance(customer_id, amount)
        const response = await electricBillPayment(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to process payment"
            })
        }
        await debitCusWallet(customer_id, amount)

        return res.status(200).json({
            status: true,
            message: "Biller paid successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const getVtpassVariationCode = async (req, res) => {
    const { serviceID } = req.params
    try {
        const response = await getVariationCode(serviceID)
        if (response.response_description !== "000") {
            return res.status(400).json({
                status: false,
                message: `Unable to fetch ${serviceID} variation code`
            })
        }
        return res.status(200).json({
            status: true,
            message: `Variation code fetched successfully for service ${serviceID}`,
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const vtpassDataPurchase = async (req, res) => {
    const { serviceID, billersCode, variation_code, amount, phone } = req.body
    const { customer_id } = req.user
    try {
        await checkCusBalance(customer_id, amount)
        const response = await dataPurchase(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to process data purchase"
            })
        }
        await debitCusWallet(customer_id, amount)

        return res.status(200).json({
            status: true,
            message: `${serviceID} purchase processed successfully`,
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassWaecRegistration = async (req, res) => {
    const { serviceID, variation_code, amount, quantity, phone } = req.body
    const { customer_id } = req.user
    try {
        total= amount * quantity
        console.log("total:", total)
        await checkCusBalance(customer_id, total)
        const response = await waecRegistration(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to process waec registration"
            })
        }
        await debitCusWallet(customer_id, total)

        return res.status(200).json({
            status: true,
            message: "Waec registration pin processed successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassVerifySmartcard = async (req, res) => {
    const { serviceID, billersCode } = req.body
    try {
        const response = await verifySmartcard(req.body)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to verify smartcard"
            })
        }
        return res.status(200).json({
            status: true,
            message: "Smartcard verified successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

const vtpassPurchaseDstvSubscription = async (req, res) => {
    const { serviceID, billersCode, variation_code, amount, phone, subscription_type, quantity } = req.body
    const { customer_id } = req.user
    try {
        await checkCusBalance(customer_id, amount)
        const response = await purchaseDstvSubscription(req.body)
        console.log("purchaseDstvSubscription response:", response)
        if (response.code !== "000") {
            return res.status(400).json({
                status: false,
                message: "Unable to process dstv subscription purchase"
            })
        }
        await debitCusWallet(customer_id, amount)

        return res.status(200).json({
            status: true,
            message: "Dstv subscription purchase processed successfully",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "An error occurred while processing the request"
        })
    }
}

module.exports = {
    startFundWallet,
    completeFundWallet,
    getVtpassAllServices,
    vtpassAirtimePurchase,
    vtpassElectricBillVerify,
    vtpassElectricBillPayment,
    getVtpassVariationCode,
    vtpassDataPurchase,
    vtpassWaecRegistration,
    vtpassVerifySmartcard,
    vtpassPurchaseDstvSubscription
}