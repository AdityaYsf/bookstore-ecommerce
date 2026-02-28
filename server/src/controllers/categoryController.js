const prisma = require('../config/database')

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      }
    })

    res.json(categories)
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    })

    res.status(201).json(category)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllCategories,
  createCategory
}