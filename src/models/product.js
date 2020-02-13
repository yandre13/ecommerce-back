const { Schema, model } = require('mongoose'),
	productSchema = new Schema(
		{
			name: {
				type: String,
				trim: true,
				required: true,
				maxlength: 32,
				unique: true,
			},
			description: {
				type: String,
				required: true,
				maxlength: 2000,
			},
			price: {
				type: Number,
				trim: true,
				required: true,
				maxlength: 32,
			},
			category: {
				type: Schema.Types.ObjectId,
				ref: 'Category',
				required: true,
			},
			quantity: {
				type: Number,
			},
			sold: {
				type: Number,
				default: 0,
			},
			photo: {
				type: String,
				required: true,
			},
			public_id: String,
			shipping: {
				type: Boolean,
				required: false,
			},
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},
		{ timestamps: true }
	)

module.exports = model('Product', productSchema)
