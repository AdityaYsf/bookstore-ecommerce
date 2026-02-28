const prisma = require('../config/database')

const getCart = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      })
    }

    res.json(cart)
  } catch (error) {
    next(error)
  }
}

const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body

    // Check book availability
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id }
      })
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) }
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId,
          quantity: parseInt(quantity)
        }
      })
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    })

    res.json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId: req.user.id }
      },
      include: { book: true }
    })

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    if (cartItem.book.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) }
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    })

    res.json(updatedCart)
  } catch (error) {
    next(error)
  }
}

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId: req.user.id }
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    })

    res.json(updatedCart)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
}