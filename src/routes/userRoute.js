const express = require("express");
const { Authorization } = require("../middleware/authentication");
const {
  createNewUser,
  loginUser,
  updateUser,
  verifyUser,
  resendOtp,
  startForgetPassword,
  completeForgetPassword,
} = require("../controller/userController");

const router = express.Router();

/**
 * @swagger
 * /user/signup:
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
 *         description: Check email for otp verification code
 *       422:
 *         description: Server error
 */


/**

 * @swagger
 * /user/login:
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
 *         description: Server error
 */


/**
 * @swagger
 * /user/verify/{email}/{otp}:
 *   post:
 *     summary: Verify a user account
 *     description: Verifies a user account using email and OTP
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email address
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: integer
 *         description: One Time Password sent to user
 *     responses:
 *       201:
 *         description: Account verified successfully
 *       422:
 *         description: An error occurred while verifying OTP
 */


/**
 * @swagger
 * /user/resend-otp/{email}:
 *   post:
 *     summary: Resend OTP to user
 *     description: Resends OTP to a user's email address
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email address
 *     responses:
 *       201:
 *         description: OTP resent successfully
 *       422:
 *         description: An error occurred while resending OTP
 */


/**
 * @swagger
 * /user/start-forget-password:
 *   post:
 *     summary: Start forget password process
 *     description: Initiates the forget password process for a user
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
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Check email for OTP to reset password
 *       422:
 *         description: An error occurred while processing the request
 */


/**
 * @swagger
 * /user/complete-forget-password/{email}/{otp}:
 *   put:
 *     summary: Complete forget password process
 *     description: Completes the forget password process for a user using email and OTP
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email address
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: integer
 *         description: One Time Password sent to user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_password
 *             properties:
 *               new_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Password reset successfully
 *       422:
 *         description: An error occurred while resetting password
 */


/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update a customer's profile
 *     description: Updates an existing user's profile information
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key-value pairs of fields to update
 *             properties:
 *               key-value pairs of fields to update:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       422:
 *         description: An error occurred while updating profile
 */

router.post("/signup", createNewUser);
router.get("/verify/:email/:otp", verifyUser);
router.post("/resend-otp/:email", resendOtp);
router.post("/start-forget-password", startForgetPassword);
router.put("/complete-forget-password/:email/:otp", completeForgetPassword);
router.post("/login", loginUser);
router.put("/update", Authorization, updateUser);

module.exports = router;
