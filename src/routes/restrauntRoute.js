const express = require('express')
const router = express.Router()
const {
  addRestraunt,
  editRestraunt,
  deleteRestraunt,
  getAllRestraunts,
  getRestraunt,
  getNearbyRestraunt,
  getRestrauntByNameOrCuisine,
} = require('../controllers/restrauntController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, addRestraunt)
router.patch('/', protect, editRestraunt)
router.delete('/', protect, deleteRestraunt)
router.get('/', getRestrauntByNameOrCuisine, getAllRestraunts)
router.get('/:id', getRestraunt)
router.get('/nearrest', getNearbyRestraunt)

module.exports = router
