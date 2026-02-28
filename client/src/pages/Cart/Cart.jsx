import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  ShieldCheck, CreditCard, Loader2, AlertCircle, Tag,
  ChevronRight
} from 'lucide-react'
import api from '../../services/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --navy:        #0f1e42;
    --navy-mid:    #1a2f5e;
    --navy-lt:     #253a6e;
    --navy-pale:   #dde4f5;
    --copper:      #d4823a;
    --copper-dk:   #b06828;
    --copper-lt:   #e8a060;
    --copper-pale: #fdecd8;
    --green:       #2d6a4f;
    --green-pale:  #d8f3e8;
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --border:      rgba(15,30,66,0.1);
    --border-lt:   rgba(15,30,66,0.06);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .cart-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ── HEADER ── */
  .cart-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  }
  .cart-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  .cart-header-left { position: relative; z-index: 2; }
  .cart-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .cart-header-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper-lt); }
  .cart-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .cart-header-title em { font-style: italic; color: var(--copper-lt); }
  .cart-continue-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    text-decoration: none;
    padding: 0.65rem 1.25rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap;
    position: relative; z-index: 2;
    backdrop-filter: blur(8px);
  }
  .cart-continue-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); }

  /* ── MAIN ── */
  .cart-main {
    max-width: 1200px; margin: 0 auto;
    padding: 2rem clamp(1.5rem, 5vw, 4rem);
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.5rem;
    align-items: start;
  }
  @media (max-width: 900px) { .cart-main { grid-template-columns: 1fr; } }

  /* ── CART ITEMS ── */
  .cart-items-wrap { display: flex; flex-direction: column; gap: 0.85rem; }

  .cart-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 1.1rem;
    display: flex; gap: 1rem; align-items: flex-start;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
    transition: all 0.25s;
  }
  .cart-item:hover { border-color: rgba(15,30,66,0.15); box-shadow: 0 6px 20px rgba(15,30,66,0.09); }

  .cart-item-cover {
    width: 70px; height: 95px;
    object-fit: cover; border-radius: 7px; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(15,30,66,0.15);
  }
  .cart-item-cover-ph {
    width: 70px; height: 95px;
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4);
  }
  .cart-item-body { flex: 1; min-width: 0; }
  .cart-item-cat {
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.3rem;
  }
  .cart-item-title {
    font-size: 0.9rem; font-weight: 700; color: var(--navy);
    line-height: 1.35; margin-bottom: 0.18rem;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .cart-item-author { font-size: 0.73rem; color: var(--ink3); margin-bottom: 0.75rem; }

  .cart-item-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }

  /* Qty control */
  .cart-qty {
    display: flex; align-items: center; gap: 0;
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 100px; overflow: hidden;
  }
  .cart-qty-btn {
    width: 30px; height: 30px;
    background: none; border: none;
    color: var(--ink3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; flex-shrink: 0;
  }
  .cart-qty-btn:hover { background: var(--navy); color: #fff; }
  .cart-qty-val {
    min-width: 28px; text-align: center;
    font-size: 0.82rem; font-weight: 700; color: var(--navy);
  }

  .cart-item-price {
    font-size: 0.95rem; font-weight: 800; color: var(--navy);
  }
  .cart-item-subtotal {
    font-size: 0.65rem; color: var(--ink4);
    background: var(--bg-soft); padding: 0.15rem 0.5rem;
    border-radius: 100px; margin-top: 0.2rem; text-align: right;
  }

  .cart-del-btn {
    width: 32px; height: 32px; flex-shrink: 0;
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 8px; cursor: pointer;
    color: var(--ink4); display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .cart-del-btn:hover { background: #fff5f5; border-color: rgba(220,38,38,0.3); color: #dc2626; }

  /* ── SUMMARY ── */
  .cart-summary {
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 4px 16px rgba(15,30,66,0.1);
    position: sticky; top: 80px;
  }
  .cart-summary-header {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1.2rem 1.4rem;
    position: relative; overflow: hidden;
  }
  .cart-summary-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .cart-summary-title {
    font-size: 0.82rem; font-weight: 700; color: #fff;
    letter-spacing: 0.06em; text-transform: uppercase;
    position: relative; z-index: 1;
  }
  .cart-summary-count {
    font-size: 0.7rem; color: rgba(200,215,255,0.55);
    margin-top: 0.15rem; position: relative; z-index: 1;
  }

  .cart-summary-body { background: var(--bg-card); padding: 1.25rem 1.4rem; }

  .cart-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.83rem; margin-bottom: 0.7rem; color: var(--ink3);
  }
  .cart-summary-row:last-of-type { margin-bottom: 0; }
  .cart-summary-row span:last-child { font-weight: 600; color: var(--ink2); }

  .cart-shipping-badge {
    background: var(--green-pale); color: var(--green);
    font-size: 0.65rem; font-weight: 700;
    padding: 0.15rem 0.55rem; border-radius: 100px;
  }

  .cart-summary-total-box {
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 9px; padding: 1rem;
    margin: 1rem 0;
    display: flex; justify-content: space-between; align-items: center;
  }
  .cart-summary-total-label { font-size: 0.72rem; color: var(--ink3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
  .cart-summary-total-val { font-size: 1.3rem; font-weight: 800; color: var(--navy); }

  /* Checkout button */
  .cart-checkout-btn {
    width: 100%; padding: 0.88rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem; font-weight: 700;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center; gap: 0.55rem;
    transition: all 0.25s;
    box-shadow: 0 4px 14px rgba(15,30,66,0.2);
    position: relative; overflow: hidden;
  }
  .cart-checkout-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .cart-checkout-btn:hover:not(:disabled)::before { opacity: 1; }
  .cart-checkout-btn:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(212,130,58,0.4); transform: translateY(-1px); }
  .cart-checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cart-checkout-btn > * { position: relative; z-index: 1; }

  /* Loading spinner */
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* Error / alert */
  .cart-alert {
    background: #fff5f5; border: 1px solid rgba(220,38,38,0.2);
    color: #dc2626; border-radius: 9px;
    padding: 0.75rem 1rem; margin-bottom: 1rem;
    font-size: 0.8rem; display: flex; gap: 0.5rem; align-items: flex-start;
  }

  .cart-security {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; color: var(--green);
    justify-content: center; margin-top: 0.75rem;
  }

  /* Empty state */
  .cart-empty {
    grid-column: 1 / -1;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 5rem 2rem;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .cart-empty-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; margin-bottom: 0.5rem;
    box-shadow: 0 6px 20px rgba(15,30,66,0.2);
  }
  .cart-empty-title { font-size: 1.1rem; font-weight: 800; color: var(--navy); }
  .cart-empty-desc  { font-size: 0.83rem; color: var(--ink3); }
  .cart-empty-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; text-decoration: none;
    font-size: 0.85rem; font-weight: 700;
    padding: 0.72rem 1.5rem; border-radius: 9px;
    margin-top: 0.5rem; transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .cart-empty-btn:hover { box-shadow: 0 6px 18px rgba(212,130,58,0.35); filter: brightness(1.08); }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n)

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart')
      setCart(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return
    try {
      await api.put(`/cart/items/${itemId}`, { quantity: qty })
      fetchCart()
    } catch (err) { console.error(err) }
  }

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`)
      fetchCart()
    } catch (err) { console.error(err) }
  }

  // ── CHECKOUT dengan Midtrans Snap ──────────────────────────
  const handleCheckout = async () => {
    if (!cart?.items?.length) return
    setError('')
    setCheckingOut(true)

    try {
      // 1. Kirim request ke backend → dapat Snap token
      const { data } = await api.post('/orders/checkout', {
        cartItems: cart.items.map((item) => ({
          bookId:   item.book.id,
          quantity: item.quantity,
          price:    item.book.price,
          title:    item.book.title,
        })),
      })

      // 2. Buka Snap popup Midtrans
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          console.log('Pembayaran berhasil:', result)
          navigate('/order-success', {
            state: { orderId: data.orderId, result },
          })
        },
        onPending: (result) => {
          console.log('Menunggu pembayaran:', result)
          navigate('/order-success', {
            state: { orderId: data.orderId, result, pending: true },
          })
        },
        onError: (result) => {
          console.error('Pembayaran gagal:', result)
          setError('Pembayaran gagal. Silakan coba lagi.')
        },
        onClose: () => {
          // User menutup popup tanpa bayar
          setCheckingOut(false)
        },
      })
    } catch (err) {
      console.error('Checkout error:', err)
      setError(
        err.response?.data?.message ||
        'Gagal memproses checkout. Silakan coba lagi.'
      )
      setCheckingOut(false)
    }
  }

  // ── Hitung total ────────────────────────────────────────────
  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + item.book.price * item.quantity, 0
  ) || 0
  const shipping    = subtotal >= 150000 ? 0 : 15000
  const total       = subtotal + shipping
  const itemCount   = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <div className="cart-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="cart-header">
        <div className="cart-header-left">
          <div className="cart-header-eyebrow">Belanja</div>
          <h1 className="cart-header-title">Keranjang <em>Saya</em></h1>
        </div>
        <Link to="/books" className="cart-continue-btn">
          <ArrowLeft size={14} /> Lanjut Belanja
        </Link>
      </div>

      {/* MAIN */}
      <div className="cart-main">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink4)' }}>
            Memuat keranjang...
          </div>
        ) : !cart?.items?.length ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><ShoppingCart size={28} /></div>
            <div className="cart-empty-title">Keranjang Kosong</div>
            <div className="cart-empty-desc">Yuk, temukan buku favoritmu!</div>
            <Link to="/books" className="cart-empty-btn">
              Lihat Katalog <ChevronRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div className="cart-items-wrap">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.book.coverImage
                    ? <img src={item.book.coverImage} alt={item.book.title} className="cart-item-cover" />
                    : <div className="cart-item-cover-ph"><Tag size={20} /></div>
                  }
                  <div className="cart-item-body">
                    {item.book.category?.name && (
                      <div className="cart-item-cat">{item.book.category.name}</div>
                    )}
                    <div className="cart-item-title">{item.book.title}</div>
                    <div className="cart-item-author">{item.book.author}</div>

                    <div className="cart-item-footer">
                      {/* Qty control */}
                      <div className="cart-qty">
                        <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="cart-item-price">{formatPrice(item.book.price)}</div>
                        {item.quantity > 1 && (
                          <div className="cart-item-subtotal">
                            {item.quantity}× = {formatPrice(item.book.price * item.quantity)}
                          </div>
                        )}
                      </div>

                      <button className="cart-del-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="cart-summary">
              <div className="cart-summary-header">
                <div className="cart-summary-title">Ringkasan Pesanan</div>
                <div className="cart-summary-count">{itemCount} item</div>
              </div>

              <div className="cart-summary-body">
                {error && (
                  <div className="cart-alert">
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                    {error}
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Ongkos Kirim</span>
                  {shipping === 0
                    ? <span className="cart-shipping-badge">Gratis</span>
                    : <span>{formatPrice(shipping)}</span>
                  }
                </div>
                {shipping > 0 && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink4)', marginBottom: '0.75rem' }}>
                    Belanja {formatPrice(150000 - subtotal)} lagi untuk gratis ongkir
                  </div>
                )}

                <div className="cart-summary-total-box">
                  <div className="cart-summary-total-label">Total Pembayaran</div>
                  <div className="cart-summary-total-val">{formatPrice(total)}</div>
                </div>

                <button
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut
                    ? <><Loader2 size={16} className="spin" /> Memproses...</>
                    : <><CreditCard size={16} /> Bayar Sekarang</>
                  }
                </button>

                <div className="cart-security">
                  <ShieldCheck size={13} />
                  Pembayaran aman & terenkripsi
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart