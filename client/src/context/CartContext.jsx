import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  // Toast state untuk feedback visual
  const [toast, setToast] = useState(null)

  /* ── Helpers ── */
  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + (item.book.price * item.quantity),
      0
    )
    setTotal(sum)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  /* ── Fetch cart ── */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/cart')
      const items = data.items || []
      setCart(items)
      calculateTotal(items)
    } catch (error) {
      if (error.response?.status === 401) {
        setCart([])
        setTotal(0)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch saat user berubah
  useEffect(() => {
    if (!user) {
      setCart([])
      setTotal(0)
      return
    }
    fetchCart()
  }, [user, fetchCart])

  /* ── Add to cart ── */
  // ✅ FIX: menerima bookId (bukan objek book)
  const addToCart = async (bookId, quantity = 1) => {
    // Pastikan bookId adalah ID murni, bukan objek
    const id = typeof bookId === 'object' ? bookId?.id : bookId

    if (!id) {
      console.error('addToCart: bookId tidak valid', bookId)
      return
    }

    if (!user) {
      showToast('Silakan login terlebih dahulu', 'error')
      return
    }

    try {
      const { data } = await api.post('/cart/items', {
        bookId: id,
        quantity,
      })
      const items = data.items || []
      setCart(items)
      calculateTotal(items)
      showToast('Buku ditambahkan ke keranjang!')
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menambahkan ke keranjang'
      showToast(msg, 'error')
      console.error('addToCart error:', error)
    }
  }

  /* ── Update quantity ── */
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId)
    try {
      const { data } = await api.put(`/cart/items/${itemId}`, { quantity })
      const items = data.items || []
      setCart(items)
      calculateTotal(items)
    } catch (error) {
      showToast('Gagal memperbarui jumlah', 'error')
      console.error('updateQuantity error:', error)
    }
  }

  /* ── Remove from cart ── */
  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/items/${itemId}`)
      const items = data.items || []
      setCart(items)
      calculateTotal(items)
      showToast('Item dihapus dari keranjang')
    } catch (error) {
      showToast('Gagal menghapus item', 'error')
      console.error('removeFromCart error:', error)
    }
  }

  /* ── Clear cart ── */
  const clearCart = () => {
    setCart([])
    setTotal(0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      total,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}

      {/* ── Toast Notification ── */}
      {toast && <CartToast message={toast.message} type={toast.type} />}
    </CartContext.Provider>
  )
}

/* ── Toast Component ── */
const CartToast = ({ message, type }) => (
  <>
    <style>{`
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(12px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .cart-toast {
        position: fixed;
        bottom: 1.75rem;
        right: 1.75rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1.25rem;
        border-radius: 2px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        min-width: 260px;
        max-width: 360px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        animation: toastIn 0.3s ease;
      }
      .cart-toast.success {
        background: #0f0d0a;
        color: #f5f0e8;
        border-left: 3px solid #c9a84c;
      }
      .cart-toast.error {
        background: #0f0d0a;
        color: #f5f0e8;
        border-left: 3px solid #b85c38;
      }
      .cart-toast-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .cart-toast.success .cart-toast-dot { background: #c9a84c; }
      .cart-toast.error   .cart-toast-dot { background: #b85c38; }
    `}</style>
    <div className={`cart-toast ${type}`}>
      <div className="cart-toast-dot" />
      {message}
    </div>
  </>
)

export const useCart = () => useContext(CartContext)
