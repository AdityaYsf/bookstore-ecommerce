const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
]

router.get('/', getAllBooks)
router.get('/:id', getBookById)
router.post('/', authenticate, authorizeAdmin, bookValidation, createBook)
router.put('/:id', authenticate, authorizeAdmin, bookValidation, updateBook)
router.delete('/:id', authenticate, authorizeAdmin, deleteBook)

module.exports = router