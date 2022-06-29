const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getSpicialUsers,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/specialusers', getSpicialUsers)

module.exports = router
