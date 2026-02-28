const { validationResult } = require('express-validator')
const prisma = require('../config/database')

const getAllBooks = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const where = {}
    
    if (category) {
      where.categoryId = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: order }
      }),
      prisma.book.count({ where })
    ])

    res.json({
      books,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params
    
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json(book)
  } catch (error) {
    next(error)
  }
}

const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      author,
      description,
      price,
      stock,
      categoryId,
      isbn,
      publisher,
      year
    } = req.body

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: categoryId || null,
        isbn,
        publisher,
        year: year ? parseInt(year) : null
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })

    res.status(201).json({
      message: 'Book created successfully',
      book
    })
  } catch (error) {
    next(error)
  }
}

const updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const {
      title,
      author,
      description,
      price,
      stock,
      categoryId,
      isbn,
      publisher,
      year
    } = req.body

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categoryId: categoryId || null,
        isbn,
        publisher,
        year: year ? parseInt(year) : null
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })

    res.json({
      message: 'Book updated successfully',
      book
    })
  } catch (error) {
    next(error)
  }
}

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.book.delete({
      where: { id }
    })

    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}