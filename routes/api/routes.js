const expres = require('express')
const router = expres.Router()

const Feature = require("../../controllers/Feature")

// Settings
router.all("/Settings/count", Feature.getCount)
router.post("/Settings/create-user", Feature.createUser)
router.post("/Settings/subscribe", Feature.setSubscription)

module.exports = router
