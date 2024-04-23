const Author = require("../models/Author")

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

module.exports = {
	getCount
}
