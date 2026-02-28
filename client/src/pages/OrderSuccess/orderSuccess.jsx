import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, XCircle, BookOpen, Home, ArrowRight, Package } from 'lucide-react'
import api from '../../services/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --navy: #0f1e42; --navy-mid: #1a2f5e;
    --copper: #d4823a; --copper-lt: #e8a060; --copper-pale: #fdecd8;
    --green: #2d6a4f; --green-pale: #d8f3e8;
    --bg-page: #f5f7ff; --bg-card: #ffffff; --bg-soft: #eef1fb;
    --border: rgba(15,30,66,0.1); --ink2: #3a4a6e; --ink3: #6272a0; --ink4: #9aa3c2;
  }

  .os-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page); color: var(--navy);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem;
  }

  .os-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 20px; padding: 3rem 2.5rem;
    max-width: 480px; width: 100%; text-align: center;
    box-shadow: 0 8px 32px rgba(15,30,66,0.1);
    animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Status icons */
  .os-icon-success { color: var(--green); margin-bottom: 1.25rem; }
  .os-icon-pending  { color: var(--copper); margin-bottom: 1.25rem; }
  .os-icon-failed   { color: #dc2626; margin-bottom: 1.25rem; }

  .os-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .os-desc  { font-size: 0.85rem; color: var(--ink3); line-height: 1.7; margin-bottom: 1.75rem; }

  /* Order info box */
  .os-info-box {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 1rem 1.25rem;
    margin-bottom: 1.75rem; text-align: left;
  }
  .os-info-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; padding: 0.3rem 0;
    border-bottom: 1px solid var(--border);
  }
  .os-info-row:last-child { border-bottom: none; }
  .os-info-label { color: var(--ink4); }
  .os-info-val   { font-weight: 700; color: var(--navy); }

  /* Status pill */
  .os-status-paid    { background: var(--green-pale); color: var(--green); padding: 0.15rem 0.65rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; }
  .os-status-pending { background: var(--copper-pale); color: var(--copper); padding: 0.15rem 0.65rem; border-radius: 100px; font-size: 0.68rem; font-weight: 700; }

  /* Buttons */
  .os-btns { display: flex; flex-direction: column; gap: 0.7rem; }
  .os-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; text-decoration: none;
    font-size: 0.88rem; font-weight: 700;
    padding: 0.8rem; border-radius: 10px;
    transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(15,30,66,0.2);
  }
  .os-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .os-btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    background: var(--bg-soft); border: 1px solid var(--border);
    color: var(--ink2); text-decoration: none;
    font-size: 0.85rem; font-weight: 600;
    padding: 0.75rem; border-radius: 10px;
    transition: all 0.2s;
  }
  .os-btn-secondary:hover { border-color: var(--navy); color: var(--navy); }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n)

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, pending } = location.state || {}
  const [order, setOrder] = useState(null)

  useEffect(() => {
    // Jika tidak ada orderId di state, redirect ke home
    if (!orderId) { navigate('/'); return }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`)
      setOrder(data)
    } catch (err) {
      console.error(err)
    }
  }

  const isPending = pending || order?.paymentStatus === 'UNPAID'
  const isPaid    = order?.paymentStatus === 'PAID'

  return (
    <div className="os-root">
      <style>{styles}</style>
      <div className="os-card">

        {/* Icon status */}
        {isPaid ? (
          <CheckCircle size={64} className="os-icon-success" />
        ) : isPending ? (
          <Clock size={64} className="os-icon-pending" />
        ) : (
          <XCircle size={64} className="os-icon-failed" />
        )}

        {/* Title */}
        <div className="os-title">
          {isPaid    && 'Pembayaran Berhasil! 🎉'}
          {isPending && 'Menunggu Pembayaran'}
          {!isPaid && !isPending && 'Pembayaran Gagal'}
        </div>

        {/* Description */}
        <div className="os-desc">
          {isPaid && 'Terima kasih! Pesananmu sedang diproses dan akan segera dikirim.'}
          {isPending && 'Silakan selesaikan pembayaran sesuai metode yang dipilih. Pesanan akan diproses setelah pembayaran dikonfirmasi.'}
          {!isPaid && !isPending && 'Pembayaran tidak berhasil. Kamu bisa mencoba kembali dari halaman keranjang.'}
        </div>

        {/* Order info */}
        {order && (
          <div className="os-info-box">
            <div className="os-info-row">
              <span className="os-info-label">ID Pesanan</span>
              <span className="os-info-val">#{order.id}</span>
            </div>
            <div className="os-info-row">
              <span className="os-info-label">Total</span>
              <span className="os-info-val">{formatPrice(order.total)}</span>
            </div>
            <div className="os-info-row">
              <span className="os-info-label">Status</span>
              <span className={isPaid ? 'os-status-paid' : 'os-status-pending'}>
                {isPaid ? '✓ Lunas' : '⏳ Menunggu'}
              </span>
            </div>
            {order.paymentMethod && (
              <div className="os-info-row">
                <span className="os-info-label">Metode</span>
                <span className="os-info-val">{order.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="os-btns">
          <Link to="/orders" className="os-btn-primary">
            <Package size={16} /> Lihat Pesanan Saya <ArrowRight size={14} />
          </Link>
          <Link to="/" className="os-btn-secondary">
            <Home size={15} /> Kembali ke Beranda
          </Link>
          {!isPaid && !isPending && (
            <Link to="/cart" className="os-btn-secondary">
              Coba Lagi
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

export default OrderSuccess