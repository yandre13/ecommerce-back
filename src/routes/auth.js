const User = require('../models/user'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken')

const signup = async (req, res) => {
	try {
		const user = new User(req.body)
		user.password = bcrypt.hashSync(req.body.password, 10)
		await user.save()
		return res.status(200).send({
			happy: true,
			user,
		})
	} catch (error) {
		if (error.code === 11000) {
			const msg = `Error. Already exists an user with that email ${req.body.email}`
			return res.status(400).send({ happy: false, error: msg })
		} else return res.status(400).send({ happy: false, error: error.message })
	}
}

const signin = async (req, res) => {
	try {
		const { email, password } = req.body,
			user = await User.findOne({ email })
		if (!user) {
			return res.status(400).send({
				happy: false,
				error: 'Invalid email',
			})
		}
		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(400).send({
				happy: false,
				error: 'Invalid password',
			})
		}
		const token = jwt.sign({ user }, process.env.SEED, { expiresIn: '90d' })
		return res.status(200).send({
			happy: true,
			token,
			user,
		})
	} catch (error) {
		return res.status(400).send({ happy: false, error: error.message })
	}
}

module.exports = {
	signup,
	signin,
}
