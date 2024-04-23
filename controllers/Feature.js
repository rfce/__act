const Author = require("../models/Author")
const { v4: uuid, validate } = require("uuid")
const path = require("path")
const fs = require("fs").promises

// Get the remaining number of activations
const getCount = async (req, res) => {
	const hash = req.query.hash

	if (validate(hash) === false) {
		return res.json({
			success: false,
			message: "Invalid hash"
		})
	}

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
		await Author.findOneAndUpdate({ hash }, { $inc: { __m: -1 } })
	}

	const file = hash + ".txt"

	const data = count === 0 ? `${count}\n✦ Please recharge to get more activations 👾` : String(count)

	const location = path.join(__dirname, "..", "assets", file)

	// Write counter data to file
	await fs.writeFile(location, data, "utf-8")

	// Send the file
	const options = {
		root: path.join(__dirname, "..", "assets")
	}

	res.sendFile(file, options, function (error) {
		if (error) {
			console.log("=> Error (sending file):", error)
		}

		fs.unlink(location)
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
