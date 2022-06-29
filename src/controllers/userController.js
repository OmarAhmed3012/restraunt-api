const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//ADD New user by registeration
const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, fav_cuisine, email, password } = req.body

  try {
    if (!first_name || !last_name || !fav_cuisine || !email || !password) {
      res.status(400)
      throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      fav_cuisine,
      email,
      password: hashedPassword,
    })

    if (user) {
      res.status(201).send({
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        fav_cuisine: user.fav_cuisine,
        email: user.email,
        token: generateToken(user._id),
      })
    }
  } catch (e) {
    res.status(400).send(e)
    throw new Error('Invalid user data')
  }
})

// Login User by email and password
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  try {
    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send({
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        fav_cuisine: user.fav_cuisine,
        email: user.email,
        token: generateToken(user._id),
      })
    }
  } catch (e) {
    res.status(400).send(e)
    throw new Error('Invalid credentials')
  }
})

//GET User Profile
const getMe = asyncHandler(async (req, res) => {
  res.status(200).send(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

//GET Special Users By Cuisine
const getSpicialUsers = asyncHandler(async (req, res) => {
  try {
    const cuisine = req.query.cuisine

    if (cuisine) {
      const pipeline = [
        {
          $lookup: {
            from: 'restaurants',
            localField: '_id',
            foreignField: 'owner',
            as: 'specialRest',
          },
        },
        {
          $match: {
            fav_cuisine: cuisine,
            'specialRest.cuisine': cuisine,
          },
        },
        {
          $project: {
            specialRest: 0,
          },
        },
      ]
      const users = await User.aggregate(pipeline)

      if (users) {
        res.status(200).json(users)
      }
    }
  } catch (e) {
    res.status(400).send(e)
    throw new Error('somthing went wrong')
  }
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getSpicialUsers,
}
