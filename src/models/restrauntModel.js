const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cuisine: {
    type: String,
    required: true,
    trim: true,
    tolowercase: true,
  },
  uniqueName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  location: {
    type: {
      type: 'String',
      default: 'Point',
    },
    coordinates: {
      //[lat, long]
      type: [Number],
      index: '2dsphere',
    },
  },
})

restaurantSchema.index({ location: '2dsphere' })
const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
