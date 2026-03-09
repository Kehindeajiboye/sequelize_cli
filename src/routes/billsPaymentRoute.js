const express = require("express");
const {
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
  vtpassPurchaseDstvSubscription,
} = require("../controller/userBillsPaymentController");
const { Authorization } = require("../middleware/authentication");

const router = express.Router();

/**

 * @swagger
 * /bills/start-fund-wallet:
 *   post:
 *     summary: Start funding wallet process
 *     description: Initiates the wallet funding process for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                type: integer
 *     responses:
 *       201:
 *         description: "Logged in successful"
 *       422:
 *         description: Server error
 */


/**

 * @swagger
 * /bills/complete-fund-wallet/{reference}:
 *   get:
 *     summary: Complete funding wallet process
 *     description: Completes the wallet funding process for a user using a reference
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Reference number for wallet funding process
 *     responses:
 *       201:
 *         description: Wallet funded successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/airtime-purchase:
 *   post:
 *     summary: Purchase airtime
 *     description: Purchases airtime for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - amount
 *               - phone
 *             properties:
 *               serviceID:
 *                 type: string
 *                 example: mtn
 *               amount:
 *                 type: integer
 *                 example: 1000
 *               phone:
 *                 type: string
 *                 example: 08012345678
 *     responses:
 *       201:
 *         description: Airtime purchased successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/electricbill-verify:
 *   post:
 *     summary: Verify electric bill
 *     description: Verifies an electric bill for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - billersCode
 *               - type
 *             properties:
 *               serviceID:
 *                 type: string
 *               billersCode:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Biller verified successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/electricbill-payment:
 *   post:
 *     summary: Pay electric bill
 *     description: Pays an electric bill for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - billersCode
 *               - variation_code
 *               - amount
 *               - phone
 *             properties:
 *               serviceID:
 *                 type: string
 *               billersCode:
 *                 type: string
 *               variation_code:
 *                 type: string
 *                 example: prepaid or postpaid
 *               amount:
 *                 type: integer
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Biller paid successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/services:
 *   get:
 *     summary: Get all services
 *     description: Gets all available services for bills payment
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Services fetched successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/variation-code/{serviceID}:
 *   get:
 *     summary: Get variation code for a service
 *     description: Gets the variation code for a specific service
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceID
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID for which to retrieve variation code
 *     responses:
 *       201:
 *         description: Variation code fetched successfully for service
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/data-purchase:
 *   post:
 *     summary: Purchase data
 *     description: Purchases data for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - billersCode
 *               - variation_code
 *               - amount
 *               - phone
 *             properties:
 *               serviceID:
 *                 type: string
 *                 example: mtn-data
 *               billersCode:
 *                 type: string
 *                 example: 08012345678(phone number for data purchase)
 *               variation_code:
 *                 type: string
 *                 example: mtn_data_1gb
 *               amount:
 *                 type: integer
 *                 example: 1000
 *               phone:
 *                 type: string
 *                 example: 08012345678(The phone number of the customer or recipient of this service)
 *     responses:
 *       201:
 *         description: Data purchased successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/waec-registration:
 *   post:
 *     summary: Purchase WAEC registration
 *     description: Purchases WAEC registration for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - variation_code
 *               - amount
 *               - quantity
 *               - phone
 *             properties:
 *               serviceID:
 *                 type: string
 *                 example: waec-registration
 *               variation_code:
 *                 type: string
 *                 example: waec-registraion
 *               amount:
 *                 type: integer
 *                 example: 14450
 *               quantity:
 *                 type: integer
 *                 example: 1
 *               phone:
 *                 type: string
 *                 example: 08012345678
 *     responses:
 *       201:
 *         description: Waec registration pin processed successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/verify-smartcard:
 *   post:
 *     summary: Verify DSTV smartcard number
 *     description: Verifies DSTV smartcard number for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - billersCode
 *             properties:
 *               serviceID:
 *                 type: string
 *                 example: dstv
 *               billersCode:
 *                 type: string 
 *                 example: 12345678(Smartcard number for dstv subscription)
 *     responses:
 *       201:
 *         description: Smartcard verified successfully
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /bills/purchase-dstv-subscription:
 *   post:
 *     summary: Purchase DSTV subscription
 *     description: Purchases DSTV subscription for a user
 *     tags:
 *       - Bills Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceID
 *               - billersCode
 *               - variation_code
 *               - amount
 *               - phone
 *               - subscription-type
 *               - quantity
 *             properties:
 *               serviceID:
 *                 type: string
 *                 example: dstv
 *               billersCode:
 *                 type: string 
 *                 example: 12345678(Smartcard number for dstv subscription)
 *               variation_code:
 *                 type: string
 *                 example: dstv-box-office
 *               amount:
 *                 type: integer
 *                 example: 800
 *               phone:
 *                 type: string
 *                 example: 08012345678
 *               subscription-type:
 *                 type: string
 *                 example: change
 *               quantity:
 *                 type: integer
 *                 example: 1(Number of viewing months for the subscription)
 *     responses:
 *       201:
 *         description: DSTV subscription purchased successfully
 *       422:
 *         description: An error occurred while processing the request
 */



// Paystack Routes for wallet funding
router.post("/start-fund-wallet", Authorization, startFundWallet);
router.get("/complete-fund-wallet/:reference", Authorization, completeFundWallet);

// VTpass Routes
router.post("/airtime-purchase", Authorization, vtpassAirtimePurchase);
router.post("/elctricbill-verify", Authorization, vtpassElectricBillVerify);
router.post("/electricbill-payment", Authorization, vtpassElectricBillPayment);
router.get("/services", Authorization, getVtpassAllServices);
router.get("/variation-code/:serviceID", Authorization, getVtpassVariationCode);
router.post("/data-purchase", Authorization, vtpassDataPurchase);
router.post("/waec-registration", Authorization, vtpassWaecRegistration);
router.post("/verify-smartcard", Authorization, vtpassVerifySmartcard);
router.post("/purchase-dstv-subscription", Authorization, vtpassPurchaseDstvSubscription);

module.exports = router;
