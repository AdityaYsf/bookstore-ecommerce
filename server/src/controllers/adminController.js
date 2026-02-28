const prisma = require('../config/database')

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = String(id)

    // hapus semua order milik user dulu
    await prisma.order.deleteMany({
      where: { userId }
    })

    // lalu hapus user
    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ message: 'User berhasil dihapus' })
  } catch (error) {
    next(error)
  }
}

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' })
    }

    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { role }
    })

    res.json({ message: 'Role berhasil diubah', user })
  } catch (error) {
    next(error)
  }
}


const getStats = async (req, res, next) => {
  try {
    const [totalBooks, totalUsers, totalOrders, orders] = await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.findMany({
        select: { totalAmount: true }
      })
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)

    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser
}