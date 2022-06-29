const Restaurant = require('../models/restrauntModel')
const asyncHandler = require('express-async-handler')

//ADD new restaurant
const addRestraunt = asyncHandler(async (req, res) => {
  const restaurant = new Restaurant({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await restaurant.save()
    res.status(201).send(restaurant)
  } catch (e) {
    res.status(400).send(e)
  }
})

//GET restaurant by ID
const getRestraunt = asyncHandler(async (req, res) => {
  const _id = req.params.id

  try {
    const restaurant = await Restaurant.findOne({ _id })

    if (!restaurant) {
      return res.status(404).send()
    }

    res.send(restaurant)
  } catch (e) {
    res.status(500).send()
  }
})

//GET nearby restaurants
const getNearbyRestraunt = asyncHandler(async (req, res) => {
  const lat = req.query.lat
  const long = req.query.long

  const distance = 1000
  console.log(long, lat)

  if (lat && long) {
    try {
      const restaurant = await Restaurant.find({
        location: {
          $near: {
            $minDistance: 5,
            $maxDistance: distance,
            $geometry: {
              type: 'Point',
              coordinates: [lat, long],
            },
          },
        },
      })
      if (!restaurant) {
        return res.status(404).send()
      }

      res.send(restaurant)
    } catch (e) {
      res.status(500).send()
    }
  }
})

//GET restaurant by Unique Name Or Cuisine
const getRestrauntByNameOrCuisine = asyncHandler(async (req, res) => {
  const uniqueName = req.query.uniquename
  const cuisine = req.query.cuisine

  if (uniqueName && cuisine) {
    res.status(400).send('you can not call cuisine and unique name together')
  }

  if (uniqueName) {
    try {
      const restaurant = await Restaurant.find({ uniqueName })

      if (!restaurant) {
        return res.status(404).send()
      }

      res.send(restaurant)
    } catch (e) {
      res.status(500).send()
    }
  } else if (cuisine) {
    try {
      const restaurant = await Restaurant.find({ cuisine })

      if (!restaurant) {
        return res.status(404).send()
      }

      res.send(restaurant)
    } catch (e) {
      res.status(500).send()
    }
  }
})

//GET all restaurant
const getAllRestraunts = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.find({})

    if (!restaurant) {
      return res.status(404).send()
    }
    res.send(restaurant)
  } catch (e) {
    res.status(500).send(e)
  }
})

//GET My Restraunts
const getMyRestraunts = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.find({ owner: req.user._id })

    if (!restaurant) {
      return res.status(404).send()
    }
    res.send(restaurant)
  } catch (e) {
    res.status(500).send(e)
  }
})

//UPDATE restaurant
const editRestraunt = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'cuisine', 'uniqueName', 'location']
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    console.log(restaurant)

    if (!restaurant) {
      return res.status(404).send()
    }

    updates.forEach((update) => (restaurant[update] = req.body[update]))
    await restaurant.save()
    res.send(restaurant)
  } catch (e) {
    res.status(400).send(e)
  }
})

//DELETE restaurant
const deleteRestraunt = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: req.params.id,
      //      owner: req.user._id,
    })

    if (!restaurant) {
      res.status(404).send()
    }

    res.send(restaurant)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = {
  addRestraunt,
  editRestraunt,
  getMyRestraunts,
  deleteRestraunt,
  getAllRestraunts,
  getRestraunt,
  getRestrauntByNameOrCuisine,
  getNearbyRestraunt,
}
