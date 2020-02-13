const { Schema, model } = require('mongoose'),
	validRoles = ['ADMIN', 'USER'],
	userSchema = new Schema(
		{
			name: {
				type: String,
				trim: true,
				required: true,
				maxlength: 32,
			},
			email: {
				type: String,
				trim: true,
				required: true,
				unique: true,
			},
			password: {
				type: String,
				required: true,
			},
			about: {
				type: String,
				trim: true,
			},
			role: {
				type: String,
				default: 'USER',
				enum: validRoles,
			},
			history: {
				type: Array,
				default: [],
			},
			active: {
				type: Boolean,
				default: true,
			},
		},
		{ timestamps: true }
	)

userSchema.methods.toJSON = function() {
	const copy = this.toObject()
	delete copy.password
	return copy
}

module.exports = model('User', userSchema)
