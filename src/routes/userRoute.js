const express = require('express')
const { Authorization } = require('../middleware/middleware')
const { createNewUser, loginUser, updateUser, verifyUser, resendOtp, startForgetPassword, completeForgetPassword } = require('../controller/userController')

const router = express.Router()


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new user record
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created successfully
 *       422:
 *         description: Bad request
 */


/**

 * @swagger
 * /login:
 *   post:
 *     summary: Login in customer
 *     description: Logins in existing user record
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Logged in successful"
 *       422:
 *         description: Bad request
 */
router.post('/signup', createNewUser)
router.get('/verify/:email/:otp', verifyUser)
router.post('/resend-otp/:email', resendOtp)
router.post('/start-forget-password', startForgetPassword)
router.put('/complete-forget-password/:email/:otp', completeForgetPassword)
router.post('/login', loginUser)
router.put('/update', Authorization, updateUser)


module.exports = router