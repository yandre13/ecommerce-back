const { Schema, model } = require('mongoose'),
	categorySchema = new Schema(
		{
			name: {
				type: String,
				trim: true,
				required: true,
				unique: true,
				maxlength: 32,
			},
			active: {
				type: Boolean,
				default: true,
			},
			user: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		},
		{ timestamps: true }
	)

module.exports = model('Category', categorySchema)
