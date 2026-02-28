const express = require('express')
const router = express.Router()
const { getAllCategories, createCategory } = require('../controllers/categoryController')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

router.get('/', getAllCategories)
router.post('/', authenticate, authorizeAdmin, createCategory)

module.exports = router