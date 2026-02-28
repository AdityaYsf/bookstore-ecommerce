import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight, Package, BarChart2, ArrowRight } from 'lucide-react'
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
    --blue-pale:   #dbeafe;
    --blue:        #2563eb;
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

  .dash-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .dash-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
  }
  .dash-header::before {
    content: 'ADMIN';
    position: absolute; right: clamp(1rem, 4vw, 3rem); bottom: -0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .dash-header::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .dash-header-left { position: relative; z-index: 2; }
  .dash-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .dash-header-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper-lt); }

  .dash-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .dash-header-title em { font-style: italic; color: var(--copper-lt); }

  .dash-header-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    text-decoration: none;
    padding: 0.7rem 1.4rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap; flex-shrink: 0;
    position: relative; z-index: 2;
    box-shadow: 0 4px 14px rgba(212,130,58,0.4);
  }
  .dash-header-btn:hover { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,130,58,0.5); }

  /* ══ MAIN ══ */
  .dash-main {
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem);
    max-width: 1400px; margin: 0 auto;
  }

  /* ══ STAT CARDS ══ */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  @media (max-width: 900px) { .dash-stats { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 500px) { .dash-stats { grid-template-columns: 1fr; } }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.6rem 1.4rem;
    display: flex; flex-direction: column; gap: 1.1rem;
    position: relative; overflow: hidden;
    transition: all 0.28s;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .stat-card::after {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 0; height: 3px;
    transition: width 0.4s ease; border-radius: 0 0 2px 0;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(15,30,66,0.1); border-color: rgba(15,30,66,0.15); }
  .stat-card:hover::after { width: 100%; }

  .stat-card-0::after { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }
  .stat-card-1::after { background: linear-gradient(90deg, var(--green), #4ade80); }
  .stat-card-2::after { background: linear-gradient(90deg, var(--blue), #60a5fa); }
  .stat-card-3::after { background: linear-gradient(90deg, var(--copper), var(--copper-lt)); }

  .stat-card-top {
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .stat-label {
    font-size: 0.67rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink4); margin-bottom: 0.45rem;
  }
  .stat-value {
    font-size: 1.75rem; font-weight: 800;
    color: var(--navy); line-height: 1;
    letter-spacing: -0.02em;
  }
  .stat-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.25s;
  }
  .stat-card:hover .stat-icon-wrap { transform: scale(1.1); }

  .stat-icon-wrap-0 { background: var(--copper-pale); color: var(--copper-dk); }
  .stat-icon-wrap-1 { background: var(--green-pale);  color: var(--green); }
  .stat-icon-wrap-2 { background: var(--blue-pale);   color: var(--blue); }
  .stat-icon-wrap-3 { background: var(--copper-pale); color: var(--copper-dk); }

  .stat-trend {
    font-size: 0.7rem; color: var(--ink4);
    display: flex; align-items: center; gap: 0.3rem;
    background: var(--bg-soft);
    padding: 0.2rem 0.65rem; border-radius: 100px;
    width: fit-content; font-weight: 500;
  }
  .stat-trend svg { color: var(--green); }

  /* ══ SECTION LABEL ══ */
  .dash-section-label {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .dash-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ══ BOTTOM GRID ══ */
  .dash-bottom {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1.25rem; margin-bottom: 2.5rem;
  }
  @media (max-width: 768px) { .dash-bottom { grid-template-columns: 1fr; } }

  .dash-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .dash-card-header {
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  .dash-card-title {
    font-size: 0.92rem; font-weight: 700; color: var(--navy);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .dash-card-title-icon {
    width: 28px; height: 28px;
    background: var(--copper-pale);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--copper-dk);
  }
  .dash-card-link {
    font-size: 0.72rem; font-weight: 600;
    color: var(--copper-dk);
    text-decoration: none;
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.7rem; border-radius: 6px;
    border: 1px solid rgba(212,130,58,0.25);
    transition: all 0.2s; white-space: nowrap;
  }
  .dash-card-link:hover { background: var(--copper-pale); border-color: var(--copper); }

  /* Empty */
  .dash-empty {
    padding: 3rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
  }
  .dash-empty-icon {
    width: 52px; height: 52px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4); margin-bottom: 0.2rem;
  }
  .dash-empty-title { font-size: 0.92rem; font-weight: 700; color: var(--ink2); }
  .dash-empty-desc  { font-size: 0.78rem; color: var(--ink4); }
  .dash-empty-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: var(--bg-soft); border: 1px solid var(--border);
    color: var(--ink4); font-size: 0.63rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.25rem 0.75rem; border-radius: 100px;
    margin-top: 0.2rem;
  }

  /* ══ QUICK ACTIONS ══ */
  .dash-actions {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
  }
  @media (max-width: 600px) { .dash-actions { grid-template-columns: 1fr; } }

  .dash-action-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.4rem;
    text-decoration: none; color: var(--navy);
    display: flex; align-items: center; gap: 1rem;
    position: relative; overflow: hidden;
    transition: all 0.25s;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .dash-action-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 0; height: 3px;
    background: linear-gradient(90deg, var(--copper), var(--copper-lt));
    transition: width 0.38s ease;
  }
  .dash-action-card:hover {
    border-color: rgba(212,130,58,0.25);
    box-shadow: 0 8px 24px rgba(15,30,66,0.1);
    transform: translateY(-2px);
  }
  .dash-action-card:hover::before { width: 100%; }
  .dash-action-card:hover .dash-action-arrow { opacity: 1; transform: translate(0,0); }
  .dash-action-card:hover .dash-action-icon { background: linear-gradient(135deg, var(--copper), var(--copper-dk)); color: #fff; }

  .dash-action-icon {
    width: 42px; height: 42px;
    background: var(--navy-pale);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--navy); flex-shrink: 0;
    transition: all 0.25s;
  }
  .dash-action-title { font-size: 0.88rem; font-weight: 700; color: var(--navy); margin-bottom: 0.18rem; }
  .dash-action-desc  { font-size: 0.72rem; color: var(--ink3); }
  .dash-action-arrow {
    margin-left: auto; color: var(--copper);
    opacity: 0; transform: translate(-4px,4px);
    transition: opacity 0.25s, transform 0.25s; flex-shrink: 0;
  }

  /* ══ SKELETON ══ */
  .stat-skeleton {
    background: var(--bg-mid); border-radius: 14px;
    height: 130px; position: relative; overflow: hidden;
  }
  .stat-skeleton::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const Dashboard = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch {
      setStats({ totalBooks: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 })
    }
  }

  const statCards = stats ? [
    { title: 'Total Buku',     value: stats.totalBooks.toLocaleString('id-ID'),  icon: BookOpen,     trend: 'Koleksi aktif',  idx: 0 },
    { title: 'Total Pesanan',  value: stats.totalOrders.toLocaleString('id-ID'), icon: ShoppingCart, trend: 'Semua waktu',    idx: 1 },
    { title: 'Total Pengguna', value: stats.totalUsers.toLocaleString('id-ID'),  icon: Users,        trend: 'Terdaftar',      idx: 2 },
    { title: 'Pendapatan',     value: formatPrice(stats.totalRevenue),           icon: DollarSign,   trend: 'Total kotor',    idx: 3 },
  ] : []

  const quickActions = [
    { to: '/admin/books',  icon: BookOpen,     title: 'Kelola Buku',      desc: 'Tambah, edit, hapus katalog' },
    { to: '/admin/orders', icon: ShoppingCart, title: 'Kelola Pesanan',   desc: 'Pantau & proses pesanan' },
    { to: '/admin/users',  icon: Users,        title: 'Kelola Pengguna',  desc: 'Manajemen akun pengguna' },
  ]

  return (
    <div className="dash-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="dash-header-eyebrow">Panel Kontrol</div>
          <h1 className="dash-header-title">Dashboard <em>Admin</em></h1>
        </div>
        <Link to="/admin/books" className="dash-header-btn">
          Kelola Buku <ArrowRight size={14} />
        </Link>
      </div>

      <div className="dash-main">

        {/* STAT CARDS */}
        {!stats ? (
          <div className="dash-stats">
            {[...Array(4)].map((_, i) => <div key={i} className="stat-skeleton" />)}
          </div>
        ) : (
          <div className="dash-stats">
            {statCards.map((s) => (
              <div key={s.idx} className={`stat-card stat-card-${s.idx}`}>
                <div className="stat-card-top">
                  <div>
                    <div className="stat-label">{s.title}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                  <div className={`stat-icon-wrap stat-icon-wrap-${s.idx}`}>
                    <s.icon size={17} />
                  </div>
                </div>
                <div className="stat-trend">
                  <TrendingUp size={11} />
                  {s.trend}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM CARDS */}
        <div className="dash-section-label">Ringkasan</div>
        <div className="dash-bottom">
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">
                <div className="dash-card-title-icon"><ShoppingCart size={13} /></div>
                Pesanan Terbaru
              </div>
              <Link to="/admin/orders" className="dash-card-link">
                Lihat Semua <ArrowUpRight size={11} />
              </Link>
            </div>
            <div className="dash-empty">
              <div className="dash-empty-icon"><BarChart2 size={22} /></div>
              <div className="dash-empty-title">Segera Hadir</div>
              <div className="dash-empty-desc">Riwayat pesanan terbaru akan tampil di sini</div>
              <span className="dash-empty-badge">Dalam pengembangan</span>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">
                <div className="dash-card-title-icon"><Package size={13} /></div>
                Stok Rendah
              </div>
              <Link to="/admin/books" className="dash-card-link">
                Kelola <ArrowUpRight size={11} />
              </Link>
            </div>
            <div className="dash-empty">
              <div className="dash-empty-icon"><Package size={22} /></div>
              <div className="dash-empty-title">Segera Hadir</div>
              <div className="dash-empty-desc">Buku dengan stok kritis akan muncul di sini</div>
              <span className="dash-empty-badge">Dalam pengembangan</span>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dash-section-label">Akses Cepat</div>
        <div className="dash-actions">
          {quickActions.map(a => (
            <Link key={a.to} to={a.to} className="dash-action-card">
              <div className="dash-action-icon"><a.icon size={17} /></div>
              <div>
                <div className="dash-action-title">{a.title}</div>
                <div className="dash-action-desc">{a.desc}</div>
              </div>
              <ArrowUpRight size={15} className="dash-action-arrow" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard