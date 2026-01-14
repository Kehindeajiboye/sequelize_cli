
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { signupSchema, loginSchema, updateSchema } = require("../validations/userValidation")
const users = require('../../models/users')

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
        const checkUser = await users.findAll({where:{email:value.email}})
        console.log(typeof users);
console.log(users);

        if (checkUser.length > 0) {
            res.status(409).json({
                status: false,
                message: "User already exists"
            })
        }
        console.log('value',checkUser)
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
        hash_password: hash })

        res.status(201).json({
            status: true,
            message: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        })
    }
}

const loginUser = async (req, res) => {
    const {error, value} = loginSchema.validate(req.body)
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message
        })
    }

    try {
       const userDetails =  await users.findAll({where: {[Op.or]: [{ email: value.email }, { phone: value.email }]}})
       console.log('userDetails:', userDetails)

         if (userDetails.length === 0) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        } 
        const user = userDetails[0]
        const isPasswordValid = bcrypt.compareSync(value.password, user.hash_password)
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({ customer_id: user.customer_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.setHeader('Authorization', token)
        res.status(200).json({
            status: true,
            message: "Login successful"
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
    const {error, value} = updateSchema.validate(req.body)
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
            message: "User updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        })
    }
}

module.exports = {
    createNewUser,
    loginUser,
    updateUser
}