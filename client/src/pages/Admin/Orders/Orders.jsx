import { useEffect, useState } from 'react'
import { Search, Eye, X, Package, Clock, CheckCircle, XCircle, Truck, Check } from 'lucide-react'
import api from "../../../services/api"

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
    --amber:       #d97706;
    --amber-pale:  #fef3c7;
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

  .ao-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .ao-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem;
    flex-wrap: wrap; position: relative; overflow: hidden;
  }
  .ao-header::before {
    content: 'ORDER';
    position: absolute; right: clamp(1rem, 4vw, 3rem); bottom: -0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .ao-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
  .ao-header-left { position: relative; z-index: 2; }
  .ao-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .ao-header-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper-lt); }
  .ao-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .ao-header-title em { font-style: italic; color: var(--copper-lt); }

  /* ══ STAT TABS ══ */
  .ao-stats {
    display: grid; grid-template-columns: repeat(6, 1fr);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  @media (max-width: 900px) { .ao-stats { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 500px) { .ao-stats { grid-template-columns: repeat(2,1fr); } }

  .ao-stat {
    padding: 1.1rem 1.2rem;
    display: flex; align-items: center; gap: 0.8rem;
    cursor: pointer; transition: background 0.2s;
    border-right: 1px solid var(--border);
    position: relative;
  }
  .ao-stat:last-child { border-right: none; }
  .ao-stat::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 3px; transition: width 0.35s ease;
  }
  .ao-stat:hover { background: var(--bg-soft); }
  .ao-stat:hover::after { width: 100%; }
  .ao-stat.active { background: var(--bg-soft); }
  .ao-stat.active::after { width: 100%; }

  .ao-stat-all::after     { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }
  .ao-stat-pending::after { background: linear-gradient(90deg, var(--amber), #fbbf24); }
  .ao-stat-process::after { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }
  .ao-stat-shipped::after { background: linear-gradient(90deg, var(--blue), #60a5fa); }
  .ao-stat-done::after    { background: linear-gradient(90deg, var(--green), #4ade80); }
  .ao-stat-cancel::after  { background: linear-gradient(90deg, #dc2626, #f87171); }

  .ao-stat-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: transform 0.25s;
  }
  .ao-stat:hover .ao-stat-icon, .ao-stat.active .ao-stat-icon { transform: scale(1.1); }

  .ao-stat-icon-all     { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-stat-icon-pending { background: var(--amber-pale);  color: var(--amber); }
  .ao-stat-icon-process { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-stat-icon-shipped { background: var(--blue-pale);   color: var(--blue); }
  .ao-stat-icon-done    { background: var(--green-pale);  color: var(--green); }
  .ao-stat-icon-cancel  { background: #fff5f5;             color: #dc2626; }

  .ao-stat-value {
    font-size: 1.35rem; font-weight: 800;
    color: var(--navy); line-height: 1; letter-spacing: -0.02em;
  }
  .ao-stat-label {
    font-size: 0.6rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink4); margin-top: 0.15rem;
  }
  .ao-stat.active .ao-stat-value { color: var(--navy); }
  .ao-stat.active .ao-stat-label { color: var(--ink3); }

  /* ══ TOOLBAR ══ */
  .ao-toolbar {
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    position: sticky; top: 66px; z-index: 89;
    box-shadow: 0 2px 8px rgba(15,30,66,0.04);
  }
  .ao-search-wrap { position: relative; flex: 1; max-width: 360px; }
  .ao-search-icon {
    position: absolute; left: 0.9rem; top: 50%;
    transform: translateY(-50%); color: var(--ink4); pointer-events: none;
    transition: color 0.2s;
  }
  .ao-search-wrap:focus-within .ao-search-icon { color: var(--copper); }
  .ao-search-input {
    width: 100%; background: var(--bg-soft);
    border: 1.5px solid var(--border); color: var(--navy);
    font-family: 'Poppins', sans-serif; font-size: 0.85rem;
    padding: 0.68rem 1rem 0.68rem 2.75rem;
    border-radius: 9px; outline: none;
    transition: all 0.2s; box-sizing: border-box;
  }
  .ao-search-input::placeholder { color: var(--ink4); }
  .ao-search-input:focus {
    background: var(--bg-card); border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .ao-count { font-size: 0.78rem; color: var(--ink3); }
  .ao-count strong { color: var(--navy); font-weight: 700; }

  /* ══ MAIN ══ */
  .ao-main {
    padding: 1.75rem clamp(1.5rem, 5vw, 4rem);
    max-width: 1400px; margin: 0 auto;
  }

  /* ══ TABLE ══ */
  .ao-table-wrap {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  .ao-table-scroll { overflow-x: auto; }
  .ao-table { width: 100%; border-collapse: collapse; }

  .ao-table thead tr {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
  }
  .ao-table thead th {
    padding: 0.9rem 1.2rem; text-align: left;
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(200,215,255,0.55); white-space: nowrap;
  }
  .ao-table thead th:last-child { text-align: right; }

  .ao-table tbody tr {
    border-bottom: 1px solid var(--border-lt); transition: background 0.15s;
  }
  .ao-table tbody tr:last-child { border-bottom: none; }
  .ao-table tbody tr:hover { background: var(--bg-soft); }
  .ao-table td { padding: 0.95rem 1.2rem; font-size: 0.84rem; color: var(--navy); vertical-align: middle; }

  /* Order ID cell */
  .ao-order-id   { font-weight: 800; font-size: 0.86rem; color: var(--navy); }
  .ao-order-date { font-size: 0.7rem; color: var(--ink4); margin-top: 0.1rem; }

  /* Customer */
  .ao-customer-name  { font-weight: 600; font-size: 0.84rem; color: var(--navy); }
  .ao-customer-email { font-size: 0.7rem; color: var(--ink3); margin-top: 0.1rem; }

  /* Total */
  .ao-total       { font-weight: 800; font-size: 0.9rem; color: var(--navy); }
  .ao-items-count { font-size: 0.68rem; color: var(--ink4); margin-top: 0.1rem; }

  /* Status badges */
  .ao-status-badge {
    display: inline-flex; align-items: center; gap: 0.32rem;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.24rem 0.65rem; border-radius: 100px; white-space: nowrap;
  }
  .ao-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .ao-status-PENDING    { background: var(--amber-pale);  color: var(--amber); }
  .ao-status-PROCESSING { background: var(--copper-pale); color: var(--copper-dk); }
  .ao-status-SHIPPED    { background: var(--blue-pale);   color: var(--blue); }
  .ao-status-DELIVERED  { background: var(--green-pale);  color: var(--green); }
  .ao-status-CANCELLED  { background: #fff5f5;             color: #dc2626; }

  /* Payment status badge */
  .ao-pay-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.62rem; font-weight: 700;
    padding: 0.18rem 0.55rem; border-radius: 100px;
  }
  .ao-pay-PAID   { background: var(--green-pale); color: var(--green); }
  .ao-pay-UNPAID { background: var(--amber-pale);  color: var(--amber); }
  .ao-pay-FAILED { background: #fff5f5; color: #dc2626; }

  /* Action button */
  .ao-actions-cell { text-align: right; }
  .ao-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    border: 1.5px solid var(--border); background: var(--bg-soft);
    cursor: pointer; color: var(--ink3); transition: all 0.2s;
  }
  .ao-action-btn:hover { border-color: rgba(212,130,58,0.4); background: var(--copper-pale); color: var(--copper-dk); }

  /* Empty */
  .ao-empty {
    padding: 4.5rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.65rem;
  }
  .ao-empty-icon {
    width: 58px; height: 58px; background: var(--bg-soft);
    border: 1px solid var(--border); border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4); margin-bottom: 0.2rem;
  }
  .ao-empty-title { font-size: 1rem; font-weight: 700; color: var(--ink2); }
  .ao-empty-desc  { font-size: 0.78rem; color: var(--ink4); }

  /* Skeleton */
  .ao-skeleton-bar {
    background: var(--bg-mid); border-radius: 6px; height: 13px;
    position: relative; overflow: hidden;
  }
  .ao-skeleton-bar::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* ══ MODAL ══ */
  .ao-overlay {
    position: fixed; inset: 0;
    background: rgba(15,30,66,0.5); backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; z-index: 200; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .ao-modal {
    background: var(--bg-card); width: 100%; max-width: 620px;
    max-height: 92svh; display: flex; flex-direction: column;
    border-radius: 16px; border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(15,30,66,0.2);
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes modalIn {
    from{opacity:0;transform:translateY(16px) scale(0.98)}
    to  {opacity:1;transform:translateY(0)    scale(1)}
  }

  .ao-modal-header {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1.4rem 1.75rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .ao-modal-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .ao-modal-title {
    font-size: 1.05rem; font-weight: 700; color: #fff;
    position: relative; z-index: 1;
  }
  .ao-modal-title em { font-style: italic; color: var(--copper-lt); }
  .ao-modal-close {
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px; cursor: pointer; color: rgba(200,215,255,0.6);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; position: relative; z-index: 1;
  }
  .ao-modal-close:hover { background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.3); color: #fca5a5; }

  .ao-modal-body { padding: 1.6rem 1.75rem; overflow-y: auto; flex: 1; }

  /* Section label */
  .ao-section-label {
    font-size: 0.63rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.9rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .ao-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Detail grid */
  .ao-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.55rem; margin-bottom: 1.4rem;
  }
  .ao-detail-cell {
    background: var(--bg-soft); border: 1px solid var(--border-lt);
    padding: 0.8rem 1rem; border-radius: 9px;
  }
  .ao-detail-cell-label {
    font-size: 0.6rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink4); margin-bottom: 0.25rem;
  }
  .ao-detail-cell-value { font-size: 0.85rem; font-weight: 600; color: var(--navy); }

  /* Items list */
  .ao-items-list { margin-bottom: 1.25rem; }
  .ao-item-row {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.75rem 0; border-bottom: 1px solid var(--border-lt);
  }
  .ao-item-row:last-child { border-bottom: none; }
  .ao-item-cover {
    width: 36px; height: 50px; object-fit: cover;
    border-radius: 5px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(15,30,66,0.15);
  }
  .ao-item-cover-ph {
    width: 36px; height: 50px; background: var(--bg-soft);
    border: 1px solid var(--border); border-radius: 5px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; color: var(--ink4);
  }
  .ao-item-title { font-size: 0.84rem; font-weight: 700; color: var(--navy); }
  .ao-item-meta  { font-size: 0.7rem; color: var(--ink3); margin-top: 0.1rem; }
  .ao-item-price { margin-left: auto; text-align: right; flex-shrink: 0; }
  .ao-item-price-val { font-size: 0.88rem; font-weight: 800; color: var(--navy); }
  .ao-item-qty       { font-size: 0.68rem; color: var(--ink4); text-align: right; }

  /* Total row */
  .ao-total-row {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1rem 1.25rem; border-radius: 10px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.4rem; position: relative; overflow: hidden;
  }
  .ao-total-row::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .ao-total-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(200,215,255,0.5); }
  .ao-total-value { font-size: 1.2rem; font-weight: 800; color: var(--copper-lt); position: relative; z-index: 1; }

  /* Status update */
  .ao-status-update {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 1.1rem 1.2rem;
    display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap;
  }
  .ao-status-update-label {
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink3); flex-shrink: 0;
  }
  .ao-status-update-select {
    flex: 1; min-width: 140px;
    background: var(--bg-card); border: 1.5px solid var(--border);
    color: var(--navy); font-family: 'Poppins', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    padding: 0.62rem 0.9rem; border-radius: 9px; outline: none;
    transition: all 0.2s; cursor: pointer;
  }
  .ao-status-update-select:focus {
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .ao-status-save-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 0.8rem; font-weight: 700;
    border: none; cursor: pointer; padding: 0.65rem 1.25rem;
    border-radius: 8px; transition: all 0.25s; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(15,30,66,0.2);
    position: relative; overflow: hidden;
  }
  .ao-status-save-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .ao-status-save-btn:hover:not(:disabled)::before { opacity: 1; }
  .ao-status-save-btn:hover:not(:disabled) { box-shadow: 0 5px 14px rgba(212,130,58,0.4); transform: translateY(-1px); }
  .ao-status-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .ao-status-save-btn > * { position: relative; z-index: 1; }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const STATUS_LIST  = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_LABEL = { PENDING:'Menunggu', PROCESSING:'Diproses', SHIPPED:'Dikirim', DELIVERED:'Selesai', CANCELLED:'Dibatalkan' }
const STATUS_ICON  = { PENDING: Clock, PROCESSING: Package, SHIPPED: Truck, DELIVERED: CheckCircle, CANCELLED: XCircle }

const STAT_TABS = [
  { key:'ALL',        label:'Semua',    iconClass:'ao-stat-icon-all',     statClass:'ao-stat-all' },
  { key:'PENDING',    label:'Menunggu', iconClass:'ao-stat-icon-pending',  statClass:'ao-stat-pending' },
  { key:'PROCESSING', label:'Diproses', iconClass:'ao-stat-icon-process',  statClass:'ao-stat-process' },
  { key:'SHIPPED',    label:'Dikirim',  iconClass:'ao-stat-icon-shipped',  statClass:'ao-stat-shipped' },
  { key:'DELIVERED',  label:'Selesai',  iconClass:'ao-stat-icon-done',     statClass:'ao-stat-done' },
  { key:'CANCELLED',  label:'Batal',    iconClass:'ao-stat-icon-cancel',   statClass:'ao-stat-cancel' },
]

const AdminOrders = () => {
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/orders')
      setOrders(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === selectedOrder.status) return
    try {
      setSavingStatus(true)
      await api.put(`/admin/orders/${selectedOrder.id}`, { status: newStatus })
      await fetchOrders()
      setSelectedOrder(prev => ({ ...prev, status: newStatus }))
    } catch { alert('Gagal memperbarui status') }
    finally { setSavingStatus(false) }
  }

  const openDetail = (order) => { setSelectedOrder(order); setNewStatus(order.status) }

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus
    const q = searchQuery.toLowerCase()
    const matchSearch = !q
      || o.id?.toString().includes(q)
      || o.user?.name?.toLowerCase().includes(q)
      || o.user?.email?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="ao-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="ao-header">
        <div className="ao-header-left">
          <div className="ao-header-eyebrow">Panel Admin</div>
          <h1 className="ao-header-title">Kelola <em>Pesanan</em></h1>
        </div>
      </div>

      {/* STAT TABS */}
      <div className="ao-stats">
        {STAT_TABS.map(tab => {
          const count = tab.key === 'ALL' ? orders.length : (counts[tab.key] || 0)
          const Icon  = tab.key === 'ALL' ? Package : STATUS_ICON[tab.key]
          return (
            <div
              key={tab.key}
              className={`ao-stat ${tab.statClass} ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setFilterStatus(tab.key)}
            >
              <div className={`ao-stat-icon ${tab.iconClass}`}><Icon size={15} /></div>
              <div>
                <div className="ao-stat-value">{count}</div>
                <div className="ao-stat-label">{tab.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* TOOLBAR */}
      <div className="ao-toolbar">
        <div className="ao-search-wrap">
          <Search size={15} className="ao-search-icon" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID pesanan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="ao-search-input"
          />
        </div>
        <span className="ao-count"><strong>{filtered.length}</strong> pesanan ditemukan</span>
      </div>

      {/* MAIN */}
      <div className="ao-main">
        <div className="ao-table-wrap">
          <div className="ao-table-scroll">
            <table className="ao-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Total</th>
                  <th>Status Order</th>
                  <th>Pembayaran</th>
                  <th style={{textAlign:'right'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((__, j) => (
                        <td key={j}>
                          <div className="ao-skeleton-bar" style={{width: j===0?'60%':j===1?'80%':'50%'}} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6}>
                    <div className="ao-empty">
                      <div className="ao-empty-icon"><Package size={26} /></div>
                      <div className="ao-empty-title">Tidak Ada Pesanan</div>
                      <div className="ao-empty-desc">
                        {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada pesanan masuk'}
                      </div>
                    </div>
                  </td></tr>
                ) : filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div className="ao-order-id">#{order.id?.toString().padStart(5,'0')}</div>
                      <div className="ao-order-date">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div className="ao-customer-name">{order.user?.name || '—'}</div>
                      <div className="ao-customer-email">{order.user?.email || '—'}</div>
                    </td>
                    <td>
                      <div className="ao-total">{formatPrice(order.totalAmount || 0)}</div>
                      <div className="ao-items-count">{order.items?.length || 0} item</div>
                    </td>
                    <td>
                      <span className={`ao-status-badge ao-status-${order.status}`}>
                        <span className="ao-status-dot" />
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`ao-pay-badge ao-pay-${order.paymentStatus || 'UNPAID'}`}>
                        <span className="ao-status-dot" />
                        {order.paymentStatus === 'PAID' ? 'Lunas' : order.paymentStatus === 'FAILED' ? 'Gagal' : 'Belum Bayar'}
                      </span>
                    </td>
                    <td className="ao-actions-cell">
                      <button className="ao-action-btn" title="Lihat Detail" onClick={() => openDetail(order)}>
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ DETAIL MODAL ══ */}
      {selectedOrder && (
        <div className="ao-overlay" onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="ao-modal">
            <div className="ao-modal-header">
              <div className="ao-modal-title">
                Pesanan <em>#{selectedOrder.id?.toString().padStart(5,'0')}</em>
              </div>
              <button className="ao-modal-close" onClick={() => setSelectedOrder(null)}><X size={15} /></button>
            </div>

            <div className="ao-modal-body">

              {/* Info grid */}
              <div className="ao-section-label">Informasi Pesanan</div>
              <div className="ao-detail-grid">
                {[
                  ['Pelanggan',    selectedOrder.user?.name || '—'],
                  ['Email',        selectedOrder.user?.email || '—'],
                  ['Tanggal Pesan',formatDate(selectedOrder.createdAt)],
                  ['Status Order', STATUS_LABEL[selectedOrder.status] || selectedOrder.status],
                  ['Pembayaran',   selectedOrder.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'],
                  ['Metode Bayar', selectedOrder.paymentMethod
                    ? selectedOrder.paymentMethod.replace(/_/g,' ').toUpperCase()
                    : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="ao-detail-cell">
                    <div className="ao-detail-cell-label">{label}</div>
                    <div className="ao-detail-cell-value">{value}</div>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="ao-section-label">Item Pesanan</div>
              <div className="ao-items-list">
                {(selectedOrder.items || []).map((item, i) => (
                  <div key={i} className="ao-item-row">
                    {item.book?.coverImage
                      ? <img src={item.book.coverImage} alt={item.book.title} className="ao-item-cover" />
                      : <div className="ao-item-cover-ph"><Package size={13} /></div>
                    }
                    <div style={{flex:1}}>
                      <div className="ao-item-title">{item.book?.title || 'Buku'}</div>
                      <div className="ao-item-meta">{item.book?.author || '—'}</div>
                    </div>
                    <div className="ao-item-price">
                      <div className="ao-item-price-val">{formatPrice(item.price || 0)}</div>
                      <div className="ao-item-qty">×{item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="ao-total-row">
                <div className="ao-total-label">Total Pembayaran</div>
                <div className="ao-total-value">{formatPrice(selectedOrder.totalAmount || 0)}</div>
              </div>

              {/* Status update */}
              <div className="ao-section-label">Perbarui Status</div>
              <div className="ao-status-update">
                <div className="ao-status-update-label">Status</div>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="ao-status-update-select"
                >
                  {STATUS_LIST.map(s => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
                <button
                  className="ao-status-save-btn"
                  onClick={handleStatusUpdate}
                  disabled={savingStatus || newStatus === selectedOrder.status}
                >
                  <Check size={13} />
                  {savingStatus ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders