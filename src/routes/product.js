const Product = require('../models/product'),
	cloudinary = require('cloudinary'),
	path = require('path'),
	fs = require('fs')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
})

const getProductById = async (req, res) => {
	try {
		const { id } = req.params,
			product = await Product.findById(id).populate('category')
		if (!product) {
			return res.status(400).send({
				happy: false,
				error: `not found a product with ${id}`,
			})
		}
		return res.status(200).send({
			happy: true,
			product,
		})
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}

const getProductsBySearch = async (req, res) => {
	try {
		const query = req.body || {}
		req.body.name ? (query.name = { $regex: req.body.name, $options: 'i' }) : {}

		!req.body.category && delete query.category
		!req.body.name && delete query.name

		console.log(query)
		const products = await Product.find(query)
		if (!products) {
			return res.status(400).send({
				happy: false,
				error: 'nothing found',
			})
		}
		return res.status(200).send({
			happy: true,
			products,
		})
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}

const getProductsByParams = async (req, res) => {
	try {
		const sortBy = req.query.sortBy ? req.query.sortBy : '_id',
			order = req.query.order ? req.query.order : 'asc',
			limit = req.query.limit ? parseInt(req.query.limit) : 6,
			products = await Product.find()
				.populate('user', 'name email role')
				.populate('category')
				.sort([[sortBy, order]])
				.limit(limit)
		if (!products) {
			return res.status(400).send({
				happy: false,
				error: 'Not found products',
			})
		}
		return res.status(200).send({
			happy: true,
			products,
		})
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}
//So I need to look for a product first, then I need to look for products with the same category and a different id
const getRelatedProducts = async (req, res) => {
	try {
		const { id } = req.params,
			product = await Product.findById(id)
		if (!product) {
			return res.status(400).send({
				happy: false,
				error: `not found a product with ${id}`,
			})
		}
		const limit = req.query.limit ? parseInt(req.query.limit) : 6,
			relatedProducts = await Product.find({
				_id: { $ne: product._id },
				category: product.category,
			})
				.limit(limit)
				.populate('category', '_id name')
		if (!relatedProducts) {
			return res.status(400).send({
				happy: false,
				error: `not found a products :c`,
			})
		}
		return res.status(200).send({
			happy: true,
			relatedProducts,
		})
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}

const getProdctsCategories = async (req, res) => {
	try {
		const list = await Product.distinct('category')
		if (!list) {
			return res.status(400).send({
				happy: false,
				error: 'not found nothing',
			})
		}
		return res.status(200).send({
			happy: true,
			list,
		})
		return
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}

const getProductsByFilters = async (req, res) => {
	try {
		console.log(req.body.filters)
		const order = req.body.order ? req.body.order : 'asc',
			sortBy = req.body.sortBy ? req.body.sortBy : 'name',
			limit = req.body.limit ? parseInt(req.body.limit) : 10,
			skip = req.body.skip ? parseInt(req.body.skip) : 0

		const state = {}
		if (req.body.filters.price[1] > 0) {
			state.price = {
				$gte: req.body.filters.price[0],
				$lte: req.body.filters.price[1],
			}
		}
		if (req.body.filters.category.length > 0) {
			state.category = req.body.filters.category
		}
		console.log(req.body.limit)

		const products = await Product.find(state)
			.populate('category')
			.sort([[sortBy, order]])
			.limit(limit)
			.skip(skip)

		if (!products) {
			return res.status(400).send({
				happy: false,
				error: 'Nothing found',
			})
		}
		return res.status(200).send({
			happy: true,
			products,
			count: products.length,
		})
	} catch (error) {
		return res.status(400).send({
			happy: false,
			error: error.message,
		})
	}
}

const postProduct = async (req, res) => {
	try {
		console.log(req.body)
		const image = req.files.image,
			ext = path.extname(image.name),
			validExts = ['.png', '.jpg', '.jpeg', '.gif', '.mp4']
		if (validExts.includes(ext)) {
			const name = image.name.replace(ext, `-${Date.now()}${ext}`)
			await image.mv(path.resolve(__dirname, `../public/images/uploads/${name}`))
			const result = await cloudinary.v2.uploader.upload(
				path.resolve(__dirname, `../public/images/uploads/${name}`),
				{ use_filename: true }
			)
			const product = new Product(req.body)
			product.photo = result.secure_url
			product.public_id = result.public_id
			product.user = req.params.userId
			await product.save()
			fs.unlinkSync(path.resolve(__dirname, `../public/images/uploads/${name}`))
			return res.status(200).send({ happy: true, product })
		} else {
			return res.status(400).send({ happy: false, msg: `invalid file` })
		}
	} catch (error) {
		return res.status(400).send({ happy: false, error: error.message })
	}
}

const putProduct = async (req, res) => {
	try {
		const { id } = req.params,
			image = req.files ? req.files.image : null
		if (image) {
			const ext = path.extname(image.name),
				validExts = ['.png', '.jpg', '.jpeg', '.gif', '.mp4']
			if (validExts.includes(ext)) {
				const product = await Product.findById(id),
					resultDelete = await cloudinary.v2.uploader.destroy(product.public_id),
					name = image.name.replace(ext, `-${Date.now()}${ext}`)
				console.log(resultDelete)
				await image.mv(path.resolve(__dirname, `../public/images/uploads/${name}`))
				const result = await cloudinary.v2.uploader.upload(
					path.resolve(__dirname, `../public/images/uploads/${name}`),
					{ use_filename: true }
				)
				const productUp = await Product.findByIdAndUpdate(id, req.body, {
					new: true,
				})
				productUp.photo = result.secure_url
				productUp.public_id = result.public_id
				await productUp.save()
				fs.unlinkSync(path.resolve(__dirname, `../public/images/uploads/${name}`))
				return res
					.status(200)
					.send({ happy: true, product: productUp, msg: 'updated' })
			}
		} else {
			const productUp = await Product.findByIdAndUpdate(id, req.body, {
				new: true,
			})
			return res
				.status(200)
				.send({ happy: true, product: productUp, msg: 'updated' })
		}
	} catch (error) {
		return res.status(400).send({ happy: false, msg: error.message })
	}
}

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id,
			product = await Product.findByIdAndDelete(id),
			result = await cloudinary.v2.uploader.destroy(product.public_id)
		console.log(id)
		console.log(result)
		return res.send({
			happy: true,
			msg: 'deleted',
		})
	} catch (e) {
		console.log(e.message)
		return res.send({
			happy: false,
			msg: `${e.message}`,
		})
	}
}

module.exports = {
	postProduct,
	getProductById,
	getProductsByParams,
	deleteProduct,
	putProduct,
	getRelatedProducts,
	getProdctsCategories,
	getProductsByFilters,
	getProductsBySearch,
}
