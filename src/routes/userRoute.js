const express = require('express')
const { Authorization } = require('../middleware/middleware')
const { createNewUser, loginUser, updateUser } = require('../controller/userController')

const router = express.Router()

router.post('/signup', createNewUser)
router.post('/login', loginUser)
router.put('/update', Authorization, updateUser)

module.exports = router