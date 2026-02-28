import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --nav-navy:      #0f1e42;
    --nav-navy-mid:  #1a2f5e;
    --nav-copper:    #d4823a;
    --nav-copper-dk: #b06828;
    --nav-copper-lt: #e8a060;
    --nav-copper-pale: #fdecd8;
    --nav-bg:        #ffffff;
    --nav-bg-soft:   #f5f7ff;
    --nav-border:    rgba(15,30,66,0.1);
    --nav-ink2:      #3a4a6e;
    --nav-ink3:      #6272a0;
    --nav-ink4:      #9aa3c2;
  }

  /* ── SHELL ── */
  .nav-root {
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'Poppins', sans-serif;
    transition: background 0.35s, box-shadow 0.35s;
  }
  .nav-root.top {
    background: var(--nav-bg);
    box-shadow: 0 1px 0 var(--nav-border);
  }
  .nav-root.scrolled {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 2px 20px rgba(15,30,66,0.1);
  }

  /* ── TOP STRIP ── */
  .nav-strip {
    background: linear-gradient(90deg, var(--nav-navy), var(--nav-navy-mid), var(--nav-navy));
    text-align: center;
    padding: 0.42rem 1rem;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(220,230,255,0.75);
    position: relative;
    overflow: hidden;
  }
  .nav-strip em { color: var(--nav-copper-lt); font-style: normal; }
  .nav-strip::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(212,130,58,0.08), transparent);
    animation: stripShimmer 4s ease-in-out infinite;
  }
  @keyframes stripShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

  /* ── MAIN BAR ── */
  .nav-bar {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 5vw, 3rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 66px;
    gap: 2rem;
  }

  /* ── LOGO ── */
  .nav-logo {
    display: flex; align-items: center; gap: 0.6rem;
    text-decoration: none; flex-shrink: 0;
  }
  .nav-logo-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--nav-copper), var(--nav-copper-dk));
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; flex-shrink: 0;
    transition: all 0.25s;
    box-shadow: 0 3px 10px rgba(212,130,58,0.3);
  }
  .nav-logo:hover .nav-logo-icon {
    transform: scale(1.08) rotate(-3deg);
    box-shadow: 0 5px 16px rgba(212,130,58,0.45);
  }
  .nav-logo-icon svg { color: #fff; }

  .nav-logo-name {
    font-size: 1.2rem; font-weight: 800;
    color: var(--nav-navy);
    letter-spacing: -0.01em;
  }
  .nav-logo-name span { color: var(--nav-copper); }

  /* ── DESKTOP LINKS ── */
  .nav-links {
    display: flex; align-items: center; gap: 0.15rem;
    list-style: none; margin: 0; padding: 0;
  }
  @media (max-width: 768px) { .nav-links { display: none; } }

  .nav-link {
    font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--nav-ink3);
    text-decoration: none;
    padding: 0.5rem 0.85rem;
    border-radius: 7px;
    position: relative;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover { color: var(--nav-navy); background: var(--nav-bg-soft); }
  .nav-link.active { color: var(--nav-navy); font-weight: 600; background: var(--nav-bg-soft); }

  /* Active underline dot */
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px;
    background: var(--nav-copper);
    border-radius: 50%;
  }

  .nav-link-admin {
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--nav-copper-dk);
    text-decoration: none;
    padding: 0.38rem 0.85rem;
    border: 1.5px solid rgba(212,130,58,0.35);
    border-radius: 7px;
    transition: all 0.22s;
    background: var(--nav-copper-pale);
  }
  .nav-link-admin:hover {
    background: var(--nav-copper);
    border-color: var(--nav-copper);
    color: #fff;
    box-shadow: 0 3px 10px rgba(212,130,58,0.3);
  }

  /* ── RIGHT ACTIONS ── */
  .nav-actions {
    display: flex; align-items: center; gap: 0.4rem;
  }
  @media (max-width: 768px) { .nav-actions .nav-user-name { display: none; } }

  /* Cart */
  .nav-cart {
    position: relative;
    color: var(--nav-ink3);
    text-decoration: none;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    border: 1.5px solid var(--nav-border);
    background: var(--nav-bg-soft);
    transition: all 0.22s;
  }
  .nav-cart:hover {
    color: var(--nav-navy);
    border-color: rgba(15,30,66,0.2);
    background: #fff;
    box-shadow: 0 2px 8px rgba(15,30,66,0.08);
  }
  .nav-cart-badge {
    position: absolute; top: -5px; right: -5px;
    background: linear-gradient(135deg, var(--nav-copper), var(--nav-copper-dk));
    color: white;
    font-size: 0.58rem; font-weight: 700;
    min-width: 17px; height: 17px;
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
    border: 2px solid var(--nav-bg);
    animation: popIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes popIn { from{transform:scale(0)} to{transform:scale(1)} }

  /* Divider */
  .nav-divider { width: 1px; height: 20px; background: var(--nav-border); margin: 0 0.1rem; }

  /* User name */
  .nav-user-name {
    font-size: 0.8rem; color: var(--nav-ink2); font-weight: 500;
    max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    background: var(--nav-bg-soft);
    padding: 0.3rem 0.75rem; border-radius: 7px;
    border: 1px solid var(--nav-border);
  }

  /* Icon button (logout) */
  .nav-icon-btn {
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: var(--nav-bg-soft);
    border: 1.5px solid var(--nav-border);
    cursor: pointer; color: var(--nav-ink3);
    border-radius: 8px;
    transition: all 0.22s;
  }
  .nav-icon-btn:hover {
    background: #fff5f5;
    border-color: rgba(220,38,38,0.25);
    color: #dc2626;
  }

  /* Login btn */
  .nav-btn-login {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: linear-gradient(135deg, var(--nav-navy), var(--nav-navy-mid));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    letter-spacing: 0.04em;
    text-decoration: none;
    padding: 0.55rem 1.2rem;
    border-radius: 8px;
    transition: all 0.22s;
    box-shadow: 0 3px 10px rgba(15,30,66,0.2);
  }
  .nav-btn-login:hover {
    background: linear-gradient(135deg, var(--nav-copper), var(--nav-copper-dk));
    box-shadow: 0 4px 14px rgba(212,130,58,0.4);
    transform: translateY(-1px);
  }

  /* Mobile toggle */
  .nav-mobile-toggle {
    display: none;
    background: var(--nav-bg-soft);
    border: 1.5px solid var(--nav-border);
    cursor: pointer;
    color: var(--nav-ink3);
    padding: 0;
    width: 38px; height: 38px;
    align-items: center; justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }
  .nav-mobile-toggle:hover { color: var(--nav-navy); border-color: rgba(15,30,66,0.2); }
  @media (max-width: 768px) { .nav-mobile-toggle { display: flex; } }

  /* ── MOBILE DRAWER ── */
  .nav-drawer {
    display: none;
    background: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
    box-shadow: 0 8px 24px rgba(15,30,66,0.1);
  }
  @media (max-width: 768px) { .nav-drawer { display: block; } }

  .nav-drawer-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 1.2rem clamp(1.5rem, 5vw, 3rem) 1.8rem;
    display: flex; flex-direction: column; gap: 0.15rem;
    animation: drawerDown 0.2s ease;
  }
  @keyframes drawerDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .nav-drawer-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.82rem 0.75rem;
    border-radius: 8px;
    font-size: 0.92rem; font-weight: 500;
    color: var(--nav-ink2);
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .nav-drawer-link:hover { color: var(--nav-navy); background: var(--nav-bg-soft); }
  .nav-drawer-link.copper { color: var(--nav-copper-dk); font-weight: 600; }
  .nav-drawer-link.copper:hover { background: var(--nav-copper-pale); }
  .nav-drawer-link.red { color: #dc2626; }
  .nav-drawer-link.red:hover { background: #fff5f5; }

  .nav-drawer-badge {
    background: linear-gradient(135deg, var(--nav-copper), var(--nav-copper-dk));
    color: white; font-size: 0.62rem; font-weight: 700;
    padding: 0.15rem 0.55rem; border-radius: 999px;
  }

  .nav-drawer-user {
    padding: 0.75rem 0.75rem 0.5rem;
    font-size: 0.72rem; color: var(--nav-ink4);
    letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
  }

  .nav-drawer-divider {
    height: 1px; background: var(--nav-border);
    margin: 0.5rem 0;
  }
`

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setIsOpen(false) }

  return (
    <>
      <style>{navStyles}</style>
      <nav className={`nav-root ${scrolled ? 'scrolled' : 'top'}`}>

        {/* Top strip */}
        <div className="nav-strip">
          Gratis Ongkir min. pembelian Rp 150.000 &nbsp;✦&nbsp; <em>Buku Original Bergaransi</em>
        </div>

        {/* Main bar */}
        <div className="nav-bar">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <BookOpen size={17} />
            </div>
            <span className="nav-logo-name">Book<span>Store</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            <li><Link to="/"      className="nav-link">Beranda</Link></li>
            <li><Link to="/books" className="nav-link">Katalog</Link></li>
            <li><Link to="/orders" className="nav-link">Pesanan Saya</Link></li>
            {isAdmin && (
              <li><Link to="/admin" className="nav-link-admin">Admin</Link></li>
            )}
          </ul>

          {/* Right actions */}
          <div className="nav-actions">
            {/* Cart */}
            <Link to="/cart" className="nav-cart" aria-label="Keranjang">
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="nav-cart-badge">{cart.length}</span>
              )}
            </Link>

            <div className="nav-divider" />

            {user ? (
              <>
                <span className="nav-user-name">{user.name}</span>
                <button onClick={handleLogout} className="nav-icon-btn" aria-label="Keluar" title="Keluar">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-btn-login">
                <User size={13} />
                Masuk
              </Link>
            )}

            {/* Mobile toggle */}
            <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isOpen && (
          <div className="nav-drawer">
            <div className="nav-drawer-inner">
              <Link to="/"      className="nav-drawer-link" onClick={() => setIsOpen(false)}>Beranda</Link>
              <Link to="/books" className="nav-drawer-link" onClick={() => setIsOpen(false)}>Katalog</Link>
              <Link to="/cart"  className="nav-drawer-link" onClick={() => setIsOpen(false)}>
                Keranjang
                {cart.length > 0 && <span className="nav-drawer-badge">{cart.length}</span>}
              </Link>

              {user ? (
                <>
                  <div className="nav-drawer-divider" />
                  <div className="nav-drawer-user">{user.name}</div>
                  {isAdmin && (
                    <Link to="/admin" className="nav-drawer-link copper" onClick={() => setIsOpen(false)}>
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="nav-drawer-link red"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <div className="nav-drawer-divider" />
                  <Link to="/login" className="nav-drawer-link copper" onClick={() => setIsOpen(false)}>
                    Masuk / Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar