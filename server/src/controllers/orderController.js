const midtransClient = require('midtrans-client')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

// ── HELPER: generate order ID unik ──────────────────────────
const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BS-${timestamp}-${random}` // BS = BookStore
}

// ============================================================
// POST /api/orders/checkout
// Buat order baru + ambil Snap token dari Midtrans
// ============================================================
const createCheckout = async (req, res) => {
  try {
    const userId = req.user.id // dari middleware auth
    const { cartItems } = req.body
    // cartItems = [{ bookId, quantity, price, title }]

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Keranjang kosong' })
    }

    // 1. Hitung total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // 2. Ambil data user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true},
    })

    // 3. Buat midtransOrderId unik
    const midtransOrderId = generateOrderId()

    // 4. Buat Order di database dengan status PENDING
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        midtransOrderId,
        items: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // 5. Siapkan parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(total), // Midtrans butuh integer
      },
      customer_details: {
        first_name: user.name || 'Customer',
        email: user.email,
        phone: user.phone || '',
      },
      item_details: cartItems.map((item) => ({
        id: item.bookId.toString(),
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.title.substring(0, 50), // max 50 karakter
      })),
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/order-success`,
        error: `${process.env.FRONTEND_URL}/cart`,
        pending: `${process.env.FRONTEND_URL}/order-success`,
      },
    }

    // 6. Minta token ke Midtrans
    const transaction = await snap.createTransaction(parameter)

    // 7. Simpan snapToken ke order
    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: transaction.token },
    })

    // 8. Kembalikan token ke frontend
    return res.json({
      token: transaction.token,
      orderId: order.id,
      midtransOrderId,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return res.status(500).json({
      message: 'Gagal membuat transaksi',
      error: error.message,
    })
  }
}

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true, coverImage: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil semua order' })
  }
}

// ============================================================
// POST /api/orders/webhook
// Menerima notifikasi pembayaran dari Midtrans
// PENTING: route ini TIDAK pakai middleware auth!
// Daftarkan di Midtrans Dashboard → Settings → Payment → Notification URL
// ============================================================
const handleWebhook = async (req, res) => {
  try {
    const notification = req.body

    // 1. Verifikasi notifikasi dari Midtrans (opsional tapi disarankan)
    const statusResponse = await snap.transaction.notification(notification)

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
    } = statusResponse

    console.log(`Webhook diterima: order ${order_id} → ${transaction_status}`)

    // 2. Tentukan paymentStatus berdasarkan transaction_status
    let paymentStatus = 'UNPAID'
    let orderStatus = 'PENDING'
    let paidAt = null

    if (transaction_status === 'capture') {
      // Kartu kredit: capture = berhasil jika fraud_status accept
      if (fraud_status === 'accept') {
        paymentStatus = 'PAID'
        orderStatus = 'PROCESSING'
        paidAt = new Date()
      } else if (fraud_status === 'challenge') {
        paymentStatus = 'CHALLENGE'
      }
    } else if (transaction_status === 'settlement') {
      // Transfer bank, e-wallet: settlement = pembayaran dikonfirmasi
      paymentStatus = 'PAID'
      orderStatus = 'PROCESSING'
      paidAt = new Date()
    } else if (transaction_status === 'pending') {
      paymentStatus = 'UNPAID'
      orderStatus = 'PENDING'
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      paymentStatus = transaction_status === 'expire' ? 'EXPIRED' : 'FAILED'
      orderStatus = 'CANCELLED'
    }

    // 3. Update order di database
    await prisma.order.update({
      where: { midtransOrderId: order_id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentMethod: payment_type,
        ...(paidAt && { paidAt }),
      },
    })

    // 4. Jika PAID, kurangi stok buku
    if (paymentStatus === 'PAID') {
      const order = await prisma.order.findUnique({
        where: { midtransOrderId: order_id },
        include: { items: true },
      })

      for (const item of order.items) {
        await prisma.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // 5. Kosongkan cart user
      const cartUser = await prisma.cart.findUnique({
        where: { userId: order.userId },
      })
      if (cartUser) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cartUser.id },
        })
      }
    }

    return res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    // Tetap return 200 agar Midtrans tidak retry terus
    return res.status(200).json({ status: 'error', message: error.message })
  }
}

// ============================================================
// GET /api/orders
// Ambil semua order milik user yang sedang login
// ============================================================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: { id: true, title: true, author: true, coverImage: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(orders)
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data pesanan' })
  }
}

// ============================================================
// GET /api/orders/:id
// Ambil detail 1 order (milik user yang login)
// ============================================================
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id
    const orderId = parseInt(req.params.id)

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true, title: true, author: true,
                coverImage: true, price: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' })
    }

    return res.json(order)
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil detail pesanan' })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body

    const allowedStatus = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' })
    }

    // 🔒 Batasi transisi status
    if (order.status === 'SHIPPED' && status !== 'DELIVERED') {
      return res.status(400).json({
        message: 'Pesanan yang sudah dikirim hanya bisa diubah menjadi SELESAI'
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    return res.json(updatedOrder)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Gagal update status' })
  }
}

module.exports = {
  createCheckout,
  handleWebhook,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus
}