import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, ChevronDown, ChevronUp, BookOpen,
  Clock, CheckCircle, XCircle, AlertCircle,
  ArrowLeft, ShoppingBag, RefreshCw, CreditCard
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
    --blue:        #2563eb;
    --blue-pale:   #dbeafe;
    --bg-page:     #f5f7ff;
    --bg-card:     #ffffff;
    --bg-soft:     #eef1fb;
    --bg-mid:      #e4e9f7;
    --border:      rgba(15,30,66,0.1);
    --border-lt:   rgba(15,30,66,0.06);
    --ink2:        #3a4a6e;
    --ink3:        #6272a0;
    --ink4:        #9aa3c2;
  }

  .mo-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .mo-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  }
  .mo-header::before {
    content: 'ORDERS';
    position: absolute; right: clamp(1rem,4vw,3rem); bottom: -0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(3rem,8vw,6.5rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .mo-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.1) 0%, transparent 60%);
    pointer-events: none;
  }
  .mo-header-left { position: relative; z-index: 2; }
  .mo-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .mo-header-eyebrow::before { content:''; display:block; width:1.5rem; height:1px; background:var(--copper-lt); }
  .mo-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .mo-header-title em { font-style: italic; color: var(--copper-lt); }
  .mo-back-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600;
    text-decoration: none; padding: 0.65rem 1.25rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap; flex-shrink: 0;
    position: relative; z-index: 2; backdrop-filter: blur(8px);
  }
  .mo-back-btn:hover { background: rgba(255,255,255,0.18); }

  /* ══ FILTER TABS ══ */
  .mo-tabs {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 0 clamp(1.5rem, 5vw, 4rem);
    display: flex; gap: 0; overflow-x: auto;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
    position: sticky; top: 66px; z-index: 89;
  }
  .mo-tab {
    padding: 0.9rem 1.2rem;
    font-size: 0.78rem; font-weight: 600; color: var(--ink4);
    cursor: pointer; border: none; background: none;
    font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 0.45rem;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: all 0.2s; position: relative; top: 1px;
  }
  .mo-tab:hover { color: var(--ink2); }
  .mo-tab.active { color: var(--navy); border-bottom-color: var(--copper); }
  .mo-tab-count {
    font-size: 0.62rem; font-weight: 700;
    padding: 0.1rem 0.5rem; border-radius: 100px;
    background: var(--bg-soft); color: var(--ink4);
  }
  .mo-tab.active .mo-tab-count { background: var(--copper-pale); color: var(--copper-dk); }

  /* ══ MAIN ══ */
  .mo-main {
    max-width: 900px; margin: 0 auto;
    padding: 2rem clamp(1.5rem, 5vw, 4rem);
  }

  /* ══ ORDER CARD ══ */
  .mo-order-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
    overflow: hidden;
    transition: box-shadow 0.25s;
  }
  .mo-order-card:hover { box-shadow: 0 6px 20px rgba(15,30,66,0.09); }

  /* Order header */
  .mo-order-head {
    padding: 1.1rem 1.4rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem;
    flex-wrap: wrap; cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .mo-order-card.open .mo-order-head {
    border-bottom-color: var(--border-lt);
  }

  .mo-order-head-left { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
  .mo-order-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--bg-soft); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink3); flex-shrink: 0;
  }
  .mo-order-id { font-size: 0.82rem; font-weight: 700; color: var(--navy); }
  .mo-order-date { font-size: 0.7rem; color: var(--ink4); margin-top: 0.1rem; }

  .mo-order-head-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .mo-order-total { font-size: 0.95rem; font-weight: 800; color: var(--navy); }

  /* Status badges */
  .mo-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 0.22rem 0.7rem; border-radius: 100px;
  }
  .mo-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .mo-badge-paid       { background: var(--green-pale); color: var(--green); }
  .mo-badge-unpaid     { background: var(--copper-pale); color: var(--copper-dk); }
  .mo-badge-failed     { background: #fff5f5; color: #dc2626; }
  .mo-badge-expired    { background: var(--bg-mid); color: var(--ink3); }
  .mo-badge-processing { background: var(--blue-pale); color: var(--blue); }
  .mo-badge-pending    { background: var(--copper-pale); color: var(--copper-dk); }
  .mo-badge-cancelled  { background: #fff5f5; color: #dc2626; }
  .mo-badge-delivered  { background: var(--green-pale); color: var(--green); }

  /* Chevron */
  .mo-chevron { color: var(--ink4); transition: transform 0.25s; flex-shrink: 0; }
  .mo-order-card.open .mo-chevron { transform: rotate(180deg); }

  /* Order body (collapsible) */
  .mo-order-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .mo-order-card.open .mo-order-body { max-height: 2000px; }

  .mo-order-body-inner { padding: 1.25rem 1.4rem; }

  /* Info row */
  .mo-info-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem; margin-bottom: 1.25rem;
  }
  @media (max-width: 600px) { .mo-info-grid { grid-template-columns: 1fr 1fr; } }
  .mo-info-cell {
    background: var(--bg-soft); border: 1px solid var(--border-lt);
    border-radius: 9px; padding: 0.75rem 0.9rem;
  }
  .mo-info-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.25rem; }
  .mo-info-val   { font-size: 0.82rem; font-weight: 700; color: var(--navy); }

  /* Section label */
  .mo-section-label {
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.75rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .mo-section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* Book items */
  .mo-book-item {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-lt);
  }
  .mo-book-item:last-child { border-bottom: none; padding-bottom: 0; }
  .mo-book-cover {
    width: 42px; height: 58px; object-fit: cover;
    border-radius: 5px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(15,30,66,0.15);
  }
  .mo-book-cover-ph {
    width: 42px; height: 58px;
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 5px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4);
  }
  .mo-book-title  { font-size: 0.85rem; font-weight: 700; color: var(--navy); line-height: 1.3; margin-bottom: 0.15rem; }
  .mo-book-author { font-size: 0.72rem; color: var(--ink3); margin-bottom: 0.3rem; }
  .mo-book-meta   { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .mo-book-qty    { font-size: 0.68rem; font-weight: 600; color: var(--ink4); background: var(--bg-soft); padding: 0.1rem 0.5rem; border-radius: 100px; }
  .mo-book-price  { font-size: 0.82rem; font-weight: 800; color: var(--navy); margin-left: auto; white-space: nowrap; }

  /* Pay now button (for pending orders) */
  .mo-pay-btn {
    width: 100%; margin-top: 1rem;
    padding: 0.78rem;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    color: #fff; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 700;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(212,130,58,0.35);
  }
  .mo-pay-btn:hover { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,130,58,0.45); }
  .mo-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Skeleton */
  .mo-skeleton {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.25rem 1.4rem;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .mo-skeleton-bar {
    background: var(--bg-mid); border-radius: 6px;
    position: relative; overflow: hidden;
  }
  .mo-skeleton-bar::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* Empty state */
  .mo-empty {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; padding: 5rem 2rem;
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .mo-empty-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; margin-bottom: 0.5rem;
    box-shadow: 0 6px 20px rgba(15,30,66,0.2);
  }
  .mo-empty-title { font-size: 1.1rem; font-weight: 800; color: var(--navy); }
  .mo-empty-desc  { font-size: 0.83rem; color: var(--ink3); }
  .mo-empty-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; text-decoration: none;
    font-size: 0.85rem; font-weight: 700;
    padding: 0.72rem 1.5rem; border-radius: 9px; margin-top: 0.5rem;
    transition: all 0.22s; box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .mo-empty-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
`

// ── Helpers ────────────────────────────────────────────────
const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n)

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const formatDateTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Payment status config
const PAYMENT_STATUS = {
  PAID:    { label: 'Lunas',      cls: 'mo-badge-paid',       icon: CheckCircle },
  UNPAID:  { label: 'Belum Bayar',cls: 'mo-badge-unpaid',     icon: Clock },
  FAILED:  { label: 'Gagal',      cls: 'mo-badge-failed',     icon: XCircle },
  EXPIRED: { label: 'Kadaluarsa', cls: 'mo-badge-expired',    icon: AlertCircle },
  CHALLENGE:{ label: 'Ditinjau', cls: 'mo-badge-unpaid',      icon: AlertCircle },
}

// Order status config
const ORDER_STATUS = {
  PENDING:    { label: 'Menunggu',   cls: 'mo-badge-pending' },
  PROCESSING: { label: 'Diproses',   cls: 'mo-badge-processing' },
  SHIPPED:    { label: 'Dikirim',    cls: 'mo-badge-processing' },
  DELIVERED:  { label: 'Diterima',   cls: 'mo-badge-delivered' },
  CANCELLED:  { label: 'Dibatalkan', cls: 'mo-badge-cancelled' },
}

// Filter tabs
const TABS = [
  { key: 'ALL',        label: 'Semua' },
  { key: 'UNPAID',     label: 'Belum Bayar' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'DELIVERED',  label: 'Selesai' },
  { key: 'CANCELLED',  label: 'Dibatalkan' },
]

// ── Component ──────────────────────────────────────────────
const MyOrders = () => {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [openId, setOpenId]       = useState(null)
  const [activeTab, setActiveTab] = useState('ALL')
  const [payingId, setPayingId]   = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Bayar lagi untuk order yang masih UNPAID
  const handlePayNow = async (order) => {
    setPayingId(order.id)
    try {
      let token = order.snapToken

      // Kalau token sudah expired, minta token baru
      if (!token) {
        const { data } = await api.post('/orders/checkout', {
          cartItems: order.items.map((item) => ({
            bookId:   item.book.id,
            quantity: item.quantity,
            price:    item.book.price,
            title:    item.book.title,
          })),
        })
        token = data.token
      }

      window.snap.pay(token, {
        onSuccess: () => { fetchOrders() },
        onPending: () => { fetchOrders() },
        onError:   () => { setPayingId(null) },
        onClose:   () => { setPayingId(null) },
      })
    } catch (err) {
      console.error(err)
      setPayingId(null)
    }
  }

  // Filter orders berdasarkan tab
  const filtered = orders.filter((o) => {
    if (activeTab === 'ALL')        return true
    if (activeTab === 'UNPAID')     return o.paymentStatus === 'UNPAID' || o.paymentStatus === 'FAILED'
    if (activeTab === 'PROCESSING') return o.status === 'PROCESSING' || o.status === 'SHIPPED'
    if (activeTab === 'DELIVERED')  return o.status === 'DELIVERED'
    if (activeTab === 'CANCELLED')  return o.status === 'CANCELLED'
    return true
  })

  // Count per tab
  const counts = {
    ALL:        orders.length,
    UNPAID:     orders.filter(o => o.paymentStatus === 'UNPAID' || o.paymentStatus === 'FAILED').length,
    PROCESSING: orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length,
    DELIVERED:  orders.filter(o => o.status === 'DELIVERED').length,
    CANCELLED:  orders.filter(o => o.status === 'CANCELLED').length,
  }

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <div className="mo-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="mo-header">
        <div className="mo-header-left">
          <div className="mo-header-eyebrow">Akun Saya</div>
          <h1 className="mo-header-title">Pesanan <em>Saya</em></h1>
        </div>
        <Link to="/books" className="mo-back-btn">
          <ArrowLeft size={14} /> Lanjut Belanja
        </Link>
      </div>

      {/* FILTER TABS */}
      <div className="mo-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`mo-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className="mo-tab-count">{counts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="mo-main">

        {/* Skeleton loading */}
        {loading && (
          [...Array(3)].map((_, i) => (
            <div key={i} className="mo-skeleton">
              <div className="mo-skeleton-bar" style={{ width:38, height:38, borderRadius:10, flexShrink:0 }} />
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                <div className="mo-skeleton-bar" style={{ width:'40%', height:13 }} />
                <div className="mo-skeleton-bar" style={{ width:'25%', height:10 }} />
              </div>
              <div className="mo-skeleton-bar" style={{ width:80, height:20 }} />
            </div>
          ))
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="mo-empty">
            <div className="mo-empty-icon">
              <ShoppingBag size={28} />
            </div>
            <div className="mo-empty-title">
              {activeTab === 'ALL' ? 'Belum Ada Pesanan' : 'Tidak Ada Pesanan di Kategori Ini'}
            </div>
            <div className="mo-empty-desc">
              {activeTab === 'ALL'
                ? 'Yuk mulai belanja dan temukan buku favoritmu!'
                : 'Coba pilih kategori lain di atas'}
            </div>
            {activeTab === 'ALL' && (
              <Link to="/books" className="mo-empty-btn">
                <BookOpen size={15} /> Lihat Katalog
              </Link>
            )}
          </div>
        )}

        {/* Order cards */}
        {!loading && filtered.map((order) => {
          const isOpen    = openId === order.id
          const pStatus   = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.UNPAID
          const oStatus   = ORDER_STATUS[order.status] || ORDER_STATUS.PENDING
          const isPending = order.paymentStatus === 'UNPAID' || order.paymentStatus === 'FAILED'
          const StatusIcon = pStatus.icon

          return (
            <div
              key={order.id}
              className={`mo-order-card ${isOpen ? 'open' : ''}`}
            >
              {/* Card header — klik untuk expand */}
              <div className="mo-order-head" onClick={() => toggle(order.id)}>
                <div className="mo-order-head-left">
                  <div className="mo-order-icon">
                    <Package size={16} />
                  </div>
                  <div>
                    <div className="mo-order-id">Pesanan #{order.id}</div>
                    <div className="mo-order-date">{formatDateTime(order.createdAt)}</div>
                  </div>
                </div>

                <div className="mo-order-head-right">
                  {/* Payment status badge */}
                  <span className={`mo-badge ${pStatus.cls}`}>
                    <span className="mo-badge-dot" />
                    {pStatus.label}
                  </span>
                  {/* Order status badge */}
                  <span className={`mo-badge ${oStatus.cls}`}>
                    <span className="mo-badge-dot" />
                    {oStatus.label}
                  </span>
                  <div className="mo-order-total">
                    {formatPrice(order.totalAmount)}
                  </div>
                  <ChevronDown size={16} className="mo-chevron" />
                </div>
              </div>

              {/* Card body — collapsible */}
              <div className="mo-order-body">
                <div className="mo-order-body-inner">

                  {/* Info grid */}
                  <div className="mo-info-grid">
                    <div className="mo-info-cell">
                      <div className="mo-info-label">ID Transaksi</div>
                      <div className="mo-info-val" style={{ fontSize:'0.72rem', wordBreak:'break-all' }}>
                        {order.midtransOrderId || '—'}
                      </div>
                    </div>
                    <div className="mo-info-cell">
                      <div className="mo-info-label">Metode Bayar</div>
                      <div className="mo-info-val">
                        {order.paymentMethod
                          ? order.paymentMethod.replace(/_/g, ' ').toUpperCase()
                          : '—'}
                      </div>
                    </div>
                    <div className="mo-info-cell">
                      <div className="mo-info-label">Tgl Bayar</div>
                      <div className="mo-info-val">{formatDate(order.paidAt)}</div>
                    </div>
                  </div>

                  {/* Book items */}
                  <div className="mo-section-label">Item Pesanan</div>
                  <div>
                    {order.items?.map((item) => (
                      <div key={item.id} className="mo-book-item">
                        {item.book?.coverImage
                          ? <img src={item.book.coverImage} alt={item.book.title} className="mo-book-cover" />
                          : <div className="mo-book-cover-ph"><BookOpen size={14} /></div>
                        }
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="mo-book-title">{item.book?.title || 'Buku'}</div>
                          <div className="mo-book-author">{item.book?.author}</div>
                          <div className="mo-book-meta">
                            <span className="mo-book-qty">{item.quantity}×</span>
                            <span style={{ fontSize:'0.72rem', color:'var(--ink4)' }}>
                              {formatPrice(item.price)} / buku
                            </span>
                          </div>
                        </div>
                        <div className="mo-book-price">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'0.9rem 0 0', marginTop:'0.5rem',
                    borderTop:'1px solid var(--border)',
                  }}>
                    <span style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--ink3)' }}>
                      Total Pembayaran
                    </span>
                    <span style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--navy)' }}>
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {/* Bayar Sekarang — hanya untuk order belum bayar */}
                  {isPending && (
                    <button
                      className="mo-pay-btn"
                      onClick={() => handlePayNow(order)}
                      disabled={payingId === order.id}
                    >
                      {payingId === order.id
                        ? <><RefreshCw size={15} style={{ animation:'spin 1s linear infinite' }} /> Memproses...</>
                        : <><CreditCard size={15} /> Bayar Sekarang</>
                      }
                    </button>
                  )}

                </div>
              </div>
            </div>
          )
        })}

      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}

export default MyOrders