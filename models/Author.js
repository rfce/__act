const mongoose = require("mongoose")
const { Schema } = mongoose

// __c: Current count of used up license
// __m: Maximum count of license that can be used
// device: unique device identifier p.s. it changes each time script runs
// refresh: timestamp of recent activation
// hash: device identifier - unique for each device
const authorSchema = Schema(
    {
        __c: {
            type: Number,
            default: 0
        },
        __m: {
            type: Number,
            required: true
        },
        device: String,
        refresh: Date,
        hash: {
            type: String,
            required: true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Author', authorSchema)

