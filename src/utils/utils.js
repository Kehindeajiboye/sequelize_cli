const { users, wallets, otp, transactions } = require('../../models')
const { v4: uuidv4 } = require('uuid')



const request_id = () => {
    const today = new Date()

    let year = today.getFullYear()
    let month = today.getMonth() + 1
    let date = today.getDate()
    let hour = today.getHours()
    let min = today.getMinutes()
    if (date < 10) {
        date = '0' + date
    }
    if (month < 10) {
        month = '0' + month
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (min < 10) {
        min = '0' + min
    }

    const id = `${year}${month}${date}${hour}${min}`
    // console.log('id', id)
    return id
}
console.log(request_id())

const generateRandomOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const checkCusBalance = async (customer_id, amount) => {
    const wallet = await wallets.findOne({ where: { customer_id } })
    if (!wallet) {
        throw new Error("Wallet not found")
    }
    if (wallet.balance < amount) {
        throw new Error("Insufficient balance")
    }
}

const debitCusWallet = async (customer_id, amount) => {
    await wallets.decrement(
        { balance: amount },
        { where: { customer_id } }
    ),
        await transactions.create({
            transaction_id: uuidv4(),
            transaction_reference: uuidv4(),
            customer_id,
            amount        })
}

module.exports = {
    request_id,
    generateRandomOtp,
    checkCusBalance,
    debitCusWallet
}