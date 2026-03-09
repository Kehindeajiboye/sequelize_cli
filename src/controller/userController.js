
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { signupSchema, loginSchema, updateSchema, startForgetPasswordSchema, completeForgetPasswordSchema } = require("../validations/userValidation")
const { users, wallets, otps } = require('../../models')
const { sendMailToUser } = require('../services/emailService')
const { generateRandomOtp } = require('../utils/utils')

const createNewUser = async (req, res) => {
    const { error, value } = signupSchema.validate(req.body)
    console.log(error)
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }
    try {
        const checkUser = await users.findAll({ where: { email: value.email } })

        if (checkUser.length > 0) {
            res.status(409).json({
                status: false,
                message: "User already exists"
            })
        }
        console.log('value', checkUser)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(value.password, salt)
        const customer_id = uuidv4()

        await users.create({
            customer_id: customer_id,
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            phone: value.phone,
            salt: salt,
            hash_password: hash
        })

        await wallets.create({
            wallet_id: uuidv4(),
            customer_id: customer_id,
            balance: 4000000
        })

        const otpCode = generateRandomOtp()
        const otpExpiry = Date.now() + 5 * 60 * 1000

        await otps.create({
            otp_code: otpCode,
            customer_id: customer_id,
            expired_at: otpExpiry
        })

        const payload = {
            fullname: `${value.first_name} ${value.last_name}`,
            email: value.email,
            otp_code: otpCode
        }

        await sendMailToUser(
            value.email,
            "Welcome To Our Services",
            payload,
            "WelcomeTemplate"
        )

        res.status(201).json({
            status: true,
            message: "Check email for otp verification code"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        })
    }
}

const verifyUser = async (req, res) => {
    const { email, otp } = req.params

    try {
        const user = await users.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        const validateOtp = await otps.findOne({ where: { customer_id: user.customer_id } })

        if (!validateOtp) {
            return res.status(400).json({
                status: false,
                message: "Otp not found"
            })
        }

        if (Date.now() > validateOtp.expired_at) {
            return res.status(400).json({
                status: false,
                message: "Otp has expired"
            })
        }

        if (otp !== validateOtp.otp_code) {
            return res.status(400).json({
                status: false,
                message: "Otp is not correct"
            })
        }

        await otps.destroy({ where: { customer_id: user.customer_id } })
        res.status(200).json({
            status: true,
            message: "Account created successfully"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while verifying OTP",
            error: error.message,
        });
    }
}

const resendOtp = async (req, res) => {
    const { email } = req.params

    try {
        const user = await users.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        const otpCode = generateRandomOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        await otps.destroy({ where: { customer_id: user.customer_id } })

        await otps.findOrCreate({
            where: { customer_id: user.customer_id },
            defaults: {
                otp_code: otpCode,
                expired_at: otpExpiry,
            },
        })

        const payload = {
            fullname: `${user.first_name} ${user.last_name}`,
            email: user.email,
            otp_code: otpCode
        };

        await sendMailToUser(
            user.email,
            "Resend OTP Verification",
            payload,
            "ResendOtpTemplate"
        )

        res.status(200).json({
            status: true,
            message: "OTP has been resent to your email"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'An error occured while resending otp',
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {

    const { error, value } = loginSchema.validate(req.body)
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }

    try {
        const userDetails = await users.findAll({ where: { [Op.or]: [{ email: value.email }, { phone: value.email }] } })
        console.log('userDetails:', userDetails)

        if (userDetails.length === 0) {
            res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        const user = userDetails[0]
        const isPasswordValid = bcrypt.compareSync(value.password, user.hash_password)
        if (!isPasswordValid) {
            res.status(401).json({
                status: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({ customer_id: user.customer_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.setHeader('Authorization', token)
        res.status(200).json({
            status: true,
            message: "Logged in successful"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        })
    }
}

const updateUser = async (req, res) => {
    const customer_id = req.id
    const { error, value } = updateSchema.validate(req.body)
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }

    try {
        const user = await users.findOne({ where: { customer_id: customer_id } })
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        await user.update(value)
        res.status(200).json({
            status: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "An error occurred while updating profile"
        })
    }
}

const startForgetPassword = async (req, res) => {
    const { error, value } = startForgetPasswordSchema.validate(req.body)

    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message || "Validation error"
        })
    }
    try {
        const userExists = await users.findOne({ where: { email: value.email } })
        if (!userExists) {
            return res.status(400).json({
                status: true,
                message: "Account not found"
            })
        }

        const otpCode = generateRandomOtp()
        const otpExpiry = Date.now() + 5 * 60 * 1000
        await otps.destroy({ where: { customer_id: userExists.customer_id } })
        await otps.create({
            otp_code: otpCode,
            customer_id: userExists.customer_id,
            expired_at: otpExpiry
        })

        const payload = {
            fullname: `${userExists.first_name} ${userExists.last_name}`,
            email: userExists.email,
            otp_code: otpCode
        }

        await sendMailToUser(
            value.email,
            "Password Reset Request",
            payload,
            "PasswordResendTemplate"
        );
        res.status(200).json({
            status: true,
            message: "Check email for OTP to reset password",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while processing the request",
            error: error.message,
        });
    }
}

const completeForgetPassword = async (req, res) => {
    const { email, otp } = req.params
    const { error, value } = completeForgetPasswordSchema.validate(req.body)
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message || "Validation error"
        })
    }

    try {
        const user = await users.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        const validateOtp = await otps.findOne({ where: { customer_id: user.customer_id } })
        if (!validateOtp) {
            return res.status(404).json({
                status: false,
                message: "OTP not found",
            });
        }

        if (Date.now() > validateOtp.expired_at) {
            return res.status(400).json({
                status: false,
                message: "OTP has expired",
            });
        }

        if (validateOtp.otp_code !== otp) {
            return res.status(400).json({
                status: false,
                message: "Invalid OTP",
            });
        }


        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(value.new_password, salt)

        await users.update(
            { salt, hash_password: hash },
            { where: { customer_id: user.customer_id } }
        )

        await otps.destroy({ where: { customer_id: user.customer_id } })

        res.status(200).json({
            status: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while resetting the password",
            error: error.message,
        })
    }
}

module.exports = {
    createNewUser,
    loginUser,
    updateUser,
    verifyUser,
    resendOtp,
    startForgetPassword,
    completeForgetPassword
}