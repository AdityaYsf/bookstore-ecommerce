const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cartController')
const { authenticate } = require('../middleware/auth')

router.get('/', authenticate, getCart)
router.post('/items', authenticate, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], addToCart)
router.put('/items/:itemId', authenticate, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], updateCartItem)
router.delete('/items/:itemId', authenticate, removeFromCart)

module.exports = router