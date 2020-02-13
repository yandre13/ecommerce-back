const User = require('../models/user'),
	jwt = require('jsonwebtoken')

const requireSignin = (req, res, next) => {
	const token = req.get('token')
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				happy: false,
				message: 'invalid token',
			})
		}
		req.user = decoded.user
		next()
	})
}

const isAuth = (req, res, next) => {
	const user = req.user
	if (!user) {
		return res.status(403).send({
			happy: false,
			error: 'Access denied',
		})
	}
	next()
}

const isAdmin = (req, res, next) => {
	const user = req.user
	if (user.role !== 'ADMIN') {
		return res.status(403).send({
			happy: false,
			error: 'Admin resource. Access denied',
		})
	}
	next()
}

const userId = async (req, res, next) => {
	try {
		const { userId } = req.params,
			user = await User.findById(userId, err => {
				if (err) {
					return res.status(400).send({
						happy: false,
						error: `not found a user with ${userId}`,
					})
				}
			})
		next()
	} catch (e) {
		return res.status(400).send({
			happy: false,
			error: e,
		})
	}
}

module.exports = { requireSignin, isAuth, isAdmin, userId }
