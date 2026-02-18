const express = require('express')
const { startFundWallet,
    completeFundWallet,
    getVtpassAllServices,
    vtpassAirtimePurchase,
    vtpassElectricBillVerify,
    vtpassElectricBillPayment,
    getVtpassVariationCode,
    vtpassDataPurchase,
    vtpassWaecRegistration,
    vtpassVerifySmartcard,
    vtpassPurchaseDstvSubscription,
} = require('../controller/userBillsPaymentController')
const { Authorization } = require('../middleware/authentication')


const router = express.Router()

// Paystack Routes for wallet funding
router.post('/start-fund-wallet', Authorization, startFundWallet)
router.get('/complete-fund-wallet/:reference', Authorization, completeFundWallet)

// VTpass Routes
router.post('/airtime-purchase', Authorization, vtpassAirtimePurchase)
router.post('/elctricbill-verify', Authorization, vtpassElectricBillVerify)
router.post('/electricbill-payment', Authorization, vtpassElectricBillPayment)
router.get('/services', Authorization, getVtpassAllServices)
router.get('/variation-code/:serviceID', Authorization, getVtpassVariationCode)
router.post('/data-purchase', Authorization, vtpassDataPurchase)
router.post('/waec-registration', Authorization, vtpassWaecRegistration)
router.post('/verify-smartcard', Authorization, vtpassVerifySmartcard)
router.post('/purchase-dstv-subscription', Authorization, vtpassPurchaseDstvSubscription)

module.exports = router