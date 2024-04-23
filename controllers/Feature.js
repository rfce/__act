const Author = require("../models/Author")
const { v4: uuid } = require("uuid")

// Get the remaining number of activations
const getCount = async (req, res) => {
	const { hash } = req.body

	const author = await Author.findOne({ hash })

	if (author === null) {
		return res.json({
			success: false,
			message: "Couldn't find counter with provided hash"
		})
	}

	const count = author.__m - author.__c

	// Decrease count
	if (count > 0) {
		await Author.findOneAndUpdate({ hash }, { __c: { $inc: -1 } })
	}

	res.json({
		success: true,
		message: "Remaining activations",
		count
	})
}

// Create a new device
// passcode - passcode is required to access this api
// 			"d18773ce-5e1f-4e2a-b282-c8f222d1f40a"
const createUser = async (req, res) => {
	const { passcode, count } = req.body

	if (passcode !== "d18773ce-5e1f-4e2a-b282-c8f222d1f40a") {
		return res.json({
			success: false,
			message: "Invalid passcode"
		})
	}

	const hash = uuid()

	await Author.create({ __m: count, hash })

	res.json({
		success: true,
		message: "User created",
		count,
		hash
	})
}

module.exports = {
	getCount,
	createUser
}
