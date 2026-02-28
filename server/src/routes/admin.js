const express = require('express')
const router = express.Router()
const { getStats, getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController')
const {getAllOrdersAdmin, updateOrderStatus} = require('../controllers/orderController')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

router.get('/stats', authenticate, authorizeAdmin, getStats)
router.get('/users', authenticate, authorizeAdmin, getAllUsers)
router.put('/users/:id', authenticate, authorizeAdmin, updateUserRole)
router.delete('/users/:id', authenticate, authorizeAdmin, deleteUser)
router.get('/orders', authenticate, authorizeAdmin, getAllOrdersAdmin)
router.put('/orders/:id', authenticate, authorizeAdmin, updateOrderStatus)

module.exports = router