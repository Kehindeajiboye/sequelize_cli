const express = require("express")
const { calendlyListAvailabilitySchedules, calendlygetAccessToken } = require("../controller/calendlyController")


const router = express.Router()



router.get("/availability-schedules", calendlyListAvailabilitySchedules)
router.post("/access-token", calendlygetAccessToken)

module.exports = router