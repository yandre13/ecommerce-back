const router = require('express').Router(),
	{ userSignupValidator } = require('../helpers/validator'),
	{ signup, signin } = require('./auth'),
	{ getUsers, getUserById } = require('./user'),
	{
		requireSignin,
		isAuth,
		isAdmin,
		userId,
	} = require('../middlewares/usersignin'),
	{
		getCategories,
		postCategory,
		getCategoryById,
		putCategory,
		deleteCategory,
	} = require('./category'),
	{
		postProduct,
		getProductById,
		getProductsByParams,
		deleteProduct,
		putProduct,
		getRelatedProducts,
		getProdctsCategories,
		getProductsByFilters,
		getProductsBySearch,
	} = require('./product'),
	{ generateToken, processPayment } = require('./braintree')
router
	//User
	.post('/signup', userSignupValidator, signup)
	.post('/signin', signin)
	.get('/users', requireSignin, getUsers)
	.get('/user/:id', requireSignin, isAuth, isAdmin, getUserById)
	//Categories
	.get('/categories', getCategories)
	.post('/category/create/:userId', requireSignin, isAuth, isAdmin, postCategory)
	.get('/category/:id', requireSignin, getCategoryById)
	.put('/category/update/:id', requireSignin, putCategory)
	.delete('/category/delete/:id', requireSignin, deleteCategory)
	//Products
	.get('/products', getProductsByParams)
	.post('/product/create/:userId', requireSignin, isAuth, isAdmin, postProduct)
	.get('/product/:id', getProductById)
	.delete('/product/delete/:id', deleteProduct)
	.put('/product/update/:id', putProduct)
	.get('/products/related/:id', getRelatedProducts)
	.get('/products/categories', getProdctsCategories)
	//Get as post
	.post('/products/by/filters', getProductsByFilters)
	.post('/products/by/search', getProductsBySearch)
	//Braintree
	.get(
		'/braintree/getToken/:userId',
		requireSignin,
		isAuth,
		userId,
		generateToken
	)
	.post(
		'/braintree/payment/:userId',
		requireSignin,
		isAuth,
		userId,
		processPayment
	)
module.exports = router
