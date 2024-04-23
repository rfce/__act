const expres = require('express')
const router = expres.Router()

const Feature = require("../../controllers/Feature")

// Settings
router.post("/Settings/count", Feature.getCount)

module.exports = router
