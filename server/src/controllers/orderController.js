const midtransClient = require("midtrans-client");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* =========================================================
   MIDTRANS CONFIG
========================================================= */
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

/* =========================================================
   HELPER
========================================================= */
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `BS-${timestamp}-${random}`;
};

/* =========================================================
   CREATE CHECKOUT
   POST /api/orders/checkout
========================================================= */
const createCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const midtransOrderId = generateOrderId();

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        paymentStatus: "UNPAID",
        midtransOrderId,
        items: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const snapPayload = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(totalAmount),
      },
      customer_details: {
        first_name: user?.name || "Customer",
        email: user?.email,
      },
      item_details: cartItems.map((item) => ({
        id: item.bookId.toString(),
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.title.substring(0, 50),
      })),
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/order-success`,
        pending: `${process.env.FRONTEND_URL}/order-success`,
        error: `${process.env.FRONTEND_URL}/cart`,
      },
    };

    const transaction = await snap.createTransaction(snapPayload);

    await prisma.order.update({
      where: { id: order.id },
      data: { snapToken: transaction.token },
    });

    return res.json({
      token: transaction.token,
      orderId: order.id,
      midtransOrderId,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return res.status(500).json({
      message: "Gagal membuat transaksi",
      error: error.message,
    });
  }
};

/* =========================================================
   MIDTRANS WEBHOOK
   POST /api/orders/webhook
========================================================= */
const handleWebhook = async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);

    const { order_id, transaction_status, fraud_status, payment_type } =
      statusResponse;

    let paymentStatus = "UNPAID";
    let orderStatus = "PENDING";
    let paidAt = null;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "PAID";
        orderStatus = "PROCESSING";
        paidAt = new Date();
      } else {
        paymentStatus = "CHALLENGE";
      }
    }

    if (transaction_status === "settlement") {
      paymentStatus = "PAID";
      orderStatus = "PROCESSING";
      paidAt = new Date();
    }

    if (transaction_status === "pending") {
      paymentStatus = "UNPAID";
      orderStatus = "PENDING";
    }

    if (["deny", "expire", "cancel"].includes(transaction_status)) {
      paymentStatus = transaction_status === "expire" ? "EXPIRED" : "FAILED";
      orderStatus = "CANCELLED";
    }

    await prisma.order.update({
      where: { midtransOrderId: order_id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentMethod: payment_type,
        ...(paidAt && { paidAt }),
      },
    });

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(200).json({ status: "error" });
  }
};

/* =========================================================
   USER ORDERS
========================================================= */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil pesanan" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: { book: true },
        },
      },
    });

    if (!order)
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail pesanan" });
  }
};

/* =========================================================
   ADMIN
========================================================= */
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { book: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil semua order" });
  }
};

/* =========================================================
   UPDATE ORDER STATUS (ADMIN)
   Revenue hanya dibuat saat DELIVERED
========================================================= */
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatus = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Status tidak dapat diubah lagi" });
    }

    if (status === "DELIVERED") {
      if (order.paymentStatus !== "PAID") {
        return res
          .status(400)
          .json({ message: "Pesanan belum dibayar" });
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: "DELIVERED" },
        });

        // Kurangi stok
        for (const item of order.items) {
          await tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Buat revenue
        await tx.revenueTransaction.create({
          data: {
            orderId,
            amount: order.totalAmount,
            type: "INCOME",
            description: `Pendapatan dari pesanan #${orderId}`,
          },
        });

        return updatedOrder;
      });

      return res.json(result);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Gagal update status" });
  }
};

/* =========================================================
   EXPORT
========================================================= */
module.exports = {
  createCheckout,
  handleWebhook,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
};
