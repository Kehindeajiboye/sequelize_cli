const express = require('express')
const { startFundWallet,
    completeFundWallet,
    getVtpassAllServices,
    vtpassAirtimePurchase,
    vtpassElectricBillVerify,
    vtpassElectricBillPayment,
    getVtpassVariationCode,
    vtpassDataPurchase,
} = require('../controller/userBillsPaymentController')


const router = express.Router()

// Paystack Routes for wallet funding
router.post('/start-fund-wallet/:customer_id', startFundWallet)
router.post('/complete-fund-wallet/:reference', completeFundWallet)

// VTpass Routes
router.post('/buy-airtime-mtn', vtpassAirtimePurchase)
router.post('/elctricbill-verify', vtpassElectricBillVerify)
router.post('/electricbill-payment', vtpassElectricBillPayment)
router.get('/services', getVtpassAllServices)
router.get('/variation-code/:serviceID', getVtpassVariationCode)
router.post('/data-purchase', vtpassDataPurchase)

module.exports = router