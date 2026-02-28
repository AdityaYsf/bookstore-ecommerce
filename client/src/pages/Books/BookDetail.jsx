import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, BookOpen, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import api from '../../services/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:   #0f0d0a;
    --cream: #f5f0e8;
    --paper: #faf7f2;
    --gold:  #c9a84c;
    --rust:  #b85c38;
    --mist:  #e8e2d8;
    --sage:  #4a6741;
  }

  .detail-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  /* ── BREADCRUMB ── */
  .detail-breadcrumb {
    background: var(--ink);
    padding: 1rem clamp(1.5rem, 6vw, 5rem);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6a6258;
    letter-spacing: 0.06em;
  }
  .breadcrumb-link {
    color: #6a6258;
    text-decoration: none;
    transition: color 0.2s;
  }
  .breadcrumb-link:hover { color: var(--gold); }
  .breadcrumb-sep { color: #3a3530; }
  .breadcrumb-current { color: #a09890; }

  /* ── BACK BUTTON ── */
  .detail-back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 0;
    transition: gap 0.2s, color 0.2s;
  }
  .detail-back:hover { color: var(--cream); gap: 0.8rem; }

  /* ── MAIN GRID ── */
  .detail-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 0;
    max-width: 1300px;
    margin: 0 auto;
    min-height: 80vh;
  }
  @media (max-width: 900px) {
    .detail-grid { grid-template-columns: 1fr; }
  }

  /* ── LEFT PANEL ── */
  .detail-left {
    background: var(--ink);
    padding: clamp(2rem, 5vw, 4rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0;
    height: 100vh;
  }
  @media (max-width: 900px) {
    .detail-left {
      position: relative;
      height: auto;
      padding: 3rem 2rem;
    }
  }

  .detail-cover-frame {
    position: relative;
    width: 100%;
    max-width: 280px;
  }
  .detail-cover-frame::before {
    content: '';
    position: absolute;
    inset: -12px;
    border: 1px solid rgba(201,168,76,0.2);
    pointer-events: none;
  }
  .detail-cover-img {
    width: 100%;
    border-radius: 2px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.6);
    display: block;
  }
  .detail-cover-placeholder {
    width: 100%;
    aspect-ratio: 3/4;
    background: linear-gradient(135deg, #1e1a16 0%, #2a2420 100%);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #4a4540;
    box-shadow: 0 32px 64px rgba(0,0,0,0.6);
  }
  .detail-cover-placeholder-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    color: #6a6258;
    text-align: center;
    padding: 0 1rem;
    line-height: 1.4;
  }

  /* Left panel meta */
  .detail-left-meta {
    margin-top: 2.5rem;
    width: 100%;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .detail-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0;
    border-bottom: 1px solid #1e1a16;
    font-size: 0.8rem;
  }
  .detail-meta-label { color: #5a5248; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.68rem; }
  .detail-meta-value { color: var(--cream); font-weight: 500; text-align: right; }

  /* Share / wishlist icons on left */
  .detail-left-actions {
    margin-top: 2rem;
    display: flex;
    gap: 0.75rem;
  }
  .left-action-btn {
    width: 38px; height: 38px;
    border: 1px solid #2a2520;
    background: none;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #5a5248;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .left-action-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.06); }
  .left-action-btn.active { border-color: var(--rust); color: var(--rust); background: rgba(184,92,56,0.08); }

  /* ── RIGHT PANEL ── */
  .detail-right {
    padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem);
    background: var(--paper);
  }

  .detail-eyebrow {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }
  .detail-category-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink);
    background: var(--gold);
    padding: 0.3rem 0.75rem;
    border-radius: 1px;
  }
  .detail-rating {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #7a7068;
  }
  .rating-stars {
    display: flex;
    gap: 2px;
    color: var(--gold);
  }

  .detail-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 900;
    color: var(--ink);
    line-height: 1.1;
    margin-bottom: 0.6rem;
  }
  .detail-author {
    font-size: 1rem;
    color: #8a8278;
    font-weight: 300;
    margin-bottom: 2rem;
  }
  .detail-author strong { color: var(--rust); font-weight: 500; }

  /* Price */
  .detail-price-block {
    background: var(--cream);
    border: 1px solid var(--mist);
    padding: 1.25rem 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .detail-price {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
  }
  .detail-price-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a09890;
    margin-bottom: 0.3rem;
  }
  .detail-stock-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
  }
  .detail-stock-pill.in { background: rgba(74,103,65,0.12); color: var(--sage); }
  .detail-stock-pill.out { background: rgba(184,92,56,0.12); color: var(--rust); }
  .detail-stock-pill-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  /* Description */
  .detail-desc-label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .detail-desc-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--mist);
  }
  .detail-desc {
    font-size: 0.92rem;
    line-height: 1.85;
    color: #5a5248;
    font-weight: 300;
    margin-bottom: 2.5rem;
  }

  /* ── QUANTITY + ADD ── */
  .detail-purchase {
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }

  .qty-control {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--mist);
    background: white;
    border-radius: 2px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .qty-btn {
    width: 42px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #7a7068;
    transition: background 0.15s, color 0.15s;
    min-height: 48px;
  }
  .qty-btn:hover { background: var(--ink); color: var(--cream); }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-btn:disabled:hover { background: none; color: #7a7068; }
  .qty-num {
    min-width: 48px;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ink);
    border-left: 1.5px solid var(--mist);
    border-right: 1.5px solid var(--mist);
    padding: 0 0.5rem;
  }

  .add-to-cart-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    background: var(--ink);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    padding: 0 2rem;
    min-height: 52px;
    border-radius: 2px;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .add-to-cart-btn::after {
    content: '';
    position: absolute;
    bottom: -4px; right: -4px;
    width: 100%; height: 100%;
    border: 1.5px solid var(--gold);
    transition: transform 0.2s;
    pointer-events: none;
  }
  .add-to-cart-btn:hover { background: var(--rust); transform: translate(-2px,-2px); }
  .add-to-cart-btn:hover::after { transform: translate(4px,4px); }
  .add-to-cart-btn:disabled {
    background: #2a2520;
    color: #5a5248;
    cursor: not-allowed;
    transform: none;
  }
  .add-to-cart-btn:disabled::after { display: none; }
  .add-to-cart-btn.added { background: var(--sage); }

  /* Stock info */
  .detail-stock-text {
    font-size: 0.78rem;
    color: #a09890;
    margin-bottom: 2rem;
  }
  .detail-stock-text strong { color: var(--ink); }

  /* Divider */
  .detail-divider {
    height: 1px;
    background: var(--mist);
    margin: 2rem 0;
  }

  /* ── BOOK SPECS ── */
  .detail-specs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--mist);
    border: 1px solid var(--mist);
    margin-top: 2rem;
  }
  @media (max-width: 500px) { .detail-specs { grid-template-columns: repeat(2,1fr); } }

  .spec-cell {
    background: white;
    padding: 1.25rem 1rem;
    text-align: center;
  }
  .spec-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a09890;
    margin-bottom: 0.4rem;
  }
  .spec-value {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ink);
  }

  /* ── LOADING & ERROR ── */
  .detail-loading {
    min-height: 100vh;
    background: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1.5rem;
    color: #5a5248;
    font-family: 'DM Sans', sans-serif;
  }
  .loading-spinner {
    width: 40px; height: 40px;
    border: 2px solid #2a2520;
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 0.78rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #5a5248;
  }

  .detail-error {
    min-height: 100vh;
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    text-align: center;
    padding: 2rem;
  }
  .detail-error-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
  }
`

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const { data } = await api.get(`/books/${id}`)
      setBook(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(book, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="detail-loading">
      <style>{styles}</style>
      <div className="loading-spinner" />
      <div className="loading-text">Memuat buku...</div>
    </div>
  )

  if (!book) return (
    <div className="detail-error">
      <style>{styles}</style>
      <BookOpen size={48} color="#c9a84c" />
      <div className="detail-error-title">Buku Tidak Ditemukan</div>
      <button onClick={() => navigate('/books')} style={{ color: '#b85c38', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}>
        ← Kembali ke Katalog
      </button>
    </div>
  )

  const inStock = book.stock > 0

  return (
    <div className="detail-root">
      <style>{styles}</style>

      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link to="/" className="breadcrumb-link">Beranda</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/books" className="breadcrumb-link">Katalog</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{book.title}</span>

        <span style={{ flex: 1 }} />

        <button className="detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
          Kembali
        </button>
      </div>

      {/* Main grid */}
      <div className="detail-grid">

        {/* LEFT — cover panel */}
        <div className="detail-left">
          <div className="detail-cover-frame">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="detail-cover-img"
              />
            ) : (
              <div className="detail-cover-placeholder">
                <BookOpen size={48} />
                <div className="detail-cover-placeholder-title">{book.title}</div>
              </div>
            )}
          </div>

          {/* Book specs listed vertically on left panel */}
          <div className="detail-left-meta">
            {[
              ['ISBN', book.isbn || '—'],
              ['Penerbit', book.publisher || '—'],
              ['Tahun Terbit', book.year || '—'],
              ['Kategori', book.category?.name || 'Umum'],
            ].map(([label, value]) => (
              <div key={label} className="detail-meta-row">
                <span className="detail-meta-label">{label}</span>
                <span className="detail-meta-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Wishlist & Share */}
          <div className="detail-left-actions">
            <button
              className={`left-action-btn ${wishlisted ? 'active' : ''}`}
              onClick={() => setWishlisted(!wishlisted)}
              title="Tambah ke Wishlist"
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              className="left-action-btn"
              onClick={() => navigator.share?.({ title: book.title, url: window.location.href })}
              title="Bagikan"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT — info + purchase */}
        <div className="detail-right">

          {/* Eyebrow */}
          <div className="detail-eyebrow">
            <span className="detail-category-badge">{book.category?.name || 'Umum'}</span>
            <div className="detail-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={i < 4 ? 'currentColor' : 'none'} />
                ))}
              </div>
              4.5 · 128 ulasan
            </div>
          </div>

          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">oleh <strong>{book.author}</strong></p>

          {/* Price block */}
          <div className="detail-price-block">
            <div>
              <div className="detail-price-label">Harga</div>
              <div className="detail-price">{formatPrice(book.price)}</div>
            </div>
            <div className={`detail-stock-pill ${inStock ? 'in' : 'out'}`}>
              <div className="detail-stock-pill-dot" />
              {inStock ? `Tersedia (${book.stock})` : 'Stok Habis'}
            </div>
          </div>

          {/* Description */}
          <div className="detail-desc-label">Deskripsi</div>
          <p className="detail-desc">
            {book.description || 'Tidak ada deskripsi tersedia untuk buku ini.'}
          </p>

          {/* Quantity + Add to Cart */}
          {inStock && (
            <>
              <div className="detail-purchase">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-num">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                    disabled={quantity >= book.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className={`add-to-cart-btn ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      Ditambahkan!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Tambah ke Keranjang
                    </>
                  )}
                </button>
              </div>

              <div className="detail-stock-text">
                Sisa stok: <strong>{book.stock} eksemplar</strong>
              </div>
            </>
          )}

          {!inStock && (
            <button className="add-to-cart-btn" disabled style={{ width: '100%', marginBottom: '1.25rem' }}>
              <ShoppingCart size={16} />
              Stok Habis
            </button>
          )}

          <div className="detail-divider" />

          {/* Specs grid */}
          <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            Informasi Buku
            <span style={{ flex: 1, height: 1, background: 'var(--mist)', display: 'block' }} />
          </div>
          <div className="detail-specs">
            {[
              ['ISBN', book.isbn || '—'],
              ['Penerbit', book.publisher || '—'],
              ['Tahun', book.year || '—'],
              ['Kategori', book.category?.name || '—'],
              ['Stok', book.stock],
              ['Bahasa', book.language || 'Indonesia'],
            ].map(([label, value]) => (
              <div key={label} className="spec-cell">
                <div className="spec-label">{label}</div>
                <div className="spec-value">{value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default BookDetail