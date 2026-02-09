const express = require('express')
const { startFundWallet,
    completeFundWallet,
    mtnAirtimePurchaseController,
    ikejaElectricBillVerifyController,
    ikejaElectricBillPaymentController
} = require('../controller/userBillsPaymentController')


const router = express.Router()

// Paystack Routes for wallet funding
router.post('/start-fund-wallet/:customer_id', startFundWallet)
router.post('/complete-fund-wallet/:reference', completeFundWallet)

// VTpass Routes
router.post('/buy-airtime-mtn', mtnAirtimePurchaseController)
router.post('/elctricbill-verify', ikejaElectricBillVerifyController)
router.post('/electricbill-payment', ikejaElectricBillPaymentController)

module.exports = router