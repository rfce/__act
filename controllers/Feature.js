const Author = require("../models/Author")
const { v4: uuid, validate } = require("uuid")
const path = require("path")
const fs = require("fs").promises

// Get the remaining number of activations
const getCount = async (req, res) => {
	const { hash, device } = req.query

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
		// Make sure that it is not an api call of same script instance
		if (author.device === device) {
			console.log("[+] Ignoring duplicate instance")
		}
		else {
			await Author.findOneAndUpdate({ hash }, { 
				__m: count - 1,
				device
			})
		}
	}

	const file = hash + ".txt"

	const data = count === 0 ? `${count}\n✦ Please recharge to get more activations 👾` : String(count)

	const location = path.join(__dirname, "..", "assets", file)

	// Write counter data to file
	await fs.writeFile(location, data, "utf-8")

	res.sendFile(location)
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

// passcode: passcode is required to access this api
// 			"1eb1bfe8-6612-448d-a135-31f8ca632da4"
// hash: hash of the device to upgrade
// count: license count to be added to device
const setSubscription = async (req, res) => {
	const { passcode, hash, count } = req.body

	if (passcode !== "1eb1bfe8-6612-448d-a135-31f8ca632da4") {
		return res.json({
			success: false,
			message: "Invalid passcode"
		})
	}

	if (validate(hash) === false) {
		return res.json({
			success: false,
			message: "Invalid device hash"
		})
	}

	const device = await Author.findOne({ hash })

	if (device === null) {
		return res.json({
			success: false,
			message: "Couldn't find device with provided hash"
		})
	}	

	const updated = await Author.findOneAndUpdate({ hash }, {
		$inc: { __m: count }
	}, { new: true })

	res.json({
		success: true,
		message: "Subscription has been sent",
		count: updated.__m
	})
}

module.exports = {
	getCount,
	createUser,
	setSubscription
}
