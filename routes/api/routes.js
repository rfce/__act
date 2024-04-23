const expres = require('express')
const router = expres.Router()

const Feature = require("../../controllers/Feature")

// Settings
router.post("/Settings/clear-database", Feature.clearDatabase)

module.exports = router
