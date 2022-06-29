const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please add a First name'],
    },
    last_name: {
      type: String,
      required: [true, 'Please add a Last name'],
    },
    fav_cuisine: {
      type: [String],
      required: [true, 'Please add a favorite Cuisine'],
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
