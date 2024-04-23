const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const apirouter = require("./routes/api/routes")

const PORT = process.env.PORT || 5010

// Loads environment variables globally during development
// Using .env file
dotenv.config()

// Client's ip is derived from the x-forwarded-for header
app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/assets', express.static("assets"))

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500', 'undefined', 'null', process.env.ORIGIN, process.env.STAGING_ORIGIN]

app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.some(item => String(origin).includes(item))) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}))

// Routes
app.use("/api", apirouter)

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => { console.log("Successfully connected to database") })
    .catch(error => {
        console.log("[-] Mongoose error")
        console.log(error)
    })

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})

