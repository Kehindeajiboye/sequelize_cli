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

module.exports = {
    request_id,
    generateRandomOtp
}