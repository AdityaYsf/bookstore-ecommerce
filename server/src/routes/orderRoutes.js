const express = require('express')
const router = express.Router()
const {
  createCheckout,
  handleWebhook,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController')

// Import middleware auth yang sudah ada di project kamu
// Sesuaikan path-nya dengan struktur project kamu
const { authenticate } = require('../middleware/auth')

// ── Public (tanpa auth) ──────────────────────────────────────
// Webhook dari Midtrans tidak pakai auth header
router.post('/webhook', handleWebhook)

// ── Protected (butuh login) ──────────────────────────────────
router.post('/checkout', authenticate, createCheckout)
router.get('/', authenticate, getMyOrders)
router.get('/:id', authenticate, getOrderById)

module.exports = router