const express = require('express')
const router = express.Router()
const {
  addRestraunt,
  editRestraunt,
  deleteRestraunt,
  getAllRestraunts,
  getRestraunt,
  getNearbyRestraunt,
  getMyRestraunts,
  getRestrauntByNameOrCuisine,
} = require('../controllers/restrauntController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, addRestraunt)
router.patch('/:id', protect, editRestraunt)
router.delete('/:id', protect, deleteRestraunt)
router.get('/me', protect, getMyRestraunts)
router.get('/', getRestrauntByNameOrCuisine)
router.get('/all', getAllRestraunts)
router.get('/:id', getRestraunt)
router.get('/nearrest', getNearbyRestraunt)

module.exports = router
