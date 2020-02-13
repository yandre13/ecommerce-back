const braintree = require('braintree')

const gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

const generateToken = async (req, res) => {
	try {
		const token = await gateway.clientToken.generate({})
		if (!token) {
			return res.status(400).send({
				happy: false,
				error: 'Something went wrong',
			})
		}
		return res.status(200).send({
			happy: true,
			token,
		})
	} catch (error) {
		return console.log(error)
	}
}

const processPayment = async (req, res) => {
	console.log(req.body)
	const paymentMethodNonce = req.body.paymentMethodNonce,
		amount = req.body.amount,
		//Charge
		newTransaction = await gateway.transaction.sale({
			amount,
			paymentMethodNonce,
			options: {
				submitForSettlement: true,
			},
		})
	if (!newTransaction) {
		return res.status(500).send({
			happy: false,
			error: 'eeee',
		})
	}
	return res.status(200).send({
		happy: true,
		result: newTransaction,
	})
}

module.exports = { generateToken, processPayment }
