import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, BookOpen } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bc-navy:        #0f1e42;
    --bc-navy-mid:    #1a2f5e;
    --bc-copper:      #d4823a;
    --bc-copper-dk:   #b06828;
    --bc-copper-lt:   #e8a060;
    --bc-copper-pale: #fdecd8;
    --bc-bg:          #ffffff;
    --bc-bg-soft:     #f5f7ff;
    --bc-border:      rgba(15,30,66,0.1);
    --bc-ink2:        #3a4a6e;
    --bc-ink3:        #6272a0;
    --bc-ink4:        #9aa3c2;
  }

  /* ── CARD ── */
  .book-card {
    font-family: 'Poppins', sans-serif;
    background: var(--bc-bg);
    border: 1px solid var(--bc-border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    box-shadow: 0 2px 8px rgba(15,30,66,0.06);
  }
  .book-card:hover {
    box-shadow: 0 16px 40px rgba(15,30,66,0.13);
    transform: translateY(-5px);
  }

  /* ── COVER ── */
  .book-cover-wrap {
    position: relative;
    background: var(--bc-bg-soft);
    aspect-ratio: 3/4;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 12px 12px 0 0;
  }

  .book-cover-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .book-card:hover .book-cover-img { transform: scale(1.06); }

  .book-cover-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--bc-bg-soft) 0%, #dde4f5 100%);
    color: var(--bc-ink3);
    gap: 0.75rem;
  }
  .book-cover-placeholder-title {
    font-size: 0.82rem; font-weight: 600;
    text-align: center; padding: 0 1rem;
    color: var(--bc-ink2); line-height: 1.3;
  }

  /* Category badge */
  .book-badge {
    position: absolute; top: 0.7rem; left: 0.7rem;
    background: var(--bc-navy);
    color: #fff;
    font-size: 0.58rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.22rem 0.6rem; border-radius: 100px;
    z-index: 2;
  }

  /* Out-of-stock badge */
  .book-badge-stock {
    position: absolute; top: 0.7rem; right: 0.7rem;
    background: rgba(220,38,38,0.9);
    color: #fff;
    font-size: 0.58rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.22rem 0.6rem; border-radius: 100px;
    z-index: 2;
  }

  /* Hover overlay */
  .book-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,30,66,0.88) 0%, rgba(15,30,66,0.4) 60%, transparent 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    gap: 0.5rem; padding: 1.2rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 3;
  }
  .book-card:hover .book-overlay { opacity: 1; }

  .overlay-btn {
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.04em;
    padding: 0.6rem 1rem;
    border-radius: 7px;
    cursor: pointer; border: none;
    text-decoration: none;
    transition: all 0.2s;
  }
  .overlay-btn:active { transform: scale(0.97); }

  .overlay-btn-primary {
    background: linear-gradient(135deg, var(--bc-copper), var(--bc-copper-dk));
    color: #fff;
    box-shadow: 0 3px 10px rgba(212,130,58,0.45);
  }
  .overlay-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

  .overlay-btn-secondary {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    backdrop-filter: blur(4px);
  }
  .overlay-btn-secondary:hover { background: rgba(255,255,255,0.25); }

  .overlay-btn-disabled {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.35);
    cursor: not-allowed;
  }

  /* ── BODY ── */
  .book-body {
    padding: 1rem 1rem 0.6rem;
    display: flex; flex-direction: column;
    flex: 1; gap: 0.25rem;
  }

  .book-category-text {
    font-size: 0.62rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--bc-copper-dk);
  }

  .book-title {
    font-size: 0.9rem; font-weight: 700;
    color: var(--bc-navy); line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
    text-decoration: none;
    transition: color 0.2s;
  }
  .book-title:hover { color: var(--bc-copper-dk); }

  .book-author {
    font-size: 0.75rem; color: var(--bc-ink3); font-weight: 400;
  }

  /* ── FOOTER ── */
  .book-footer {
    padding: 0.6rem 1rem 1rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 0.5rem;
    border-top: 1px solid rgba(15,30,66,0.07);
    margin-top: 0.4rem;
  }

  .book-price-label {
    font-size: 0.6rem; color: var(--bc-ink4); font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 0.1rem;
  }
  .book-price {
    font-size: 1rem; font-weight: 800; color: var(--bc-navy);
    letter-spacing: -0.01em;
  }

  /* Cart icon button */
  .book-cart-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 8px;
    border: 1.5px solid var(--bc-border);
    background: var(--bc-bg-soft);
    color: var(--bc-ink3);
    cursor: pointer;
    transition: all 0.22s;
    flex-shrink: 0;
  }
  .book-cart-btn:hover:not(.disabled) {
    background: linear-gradient(135deg, var(--bc-copper), var(--bc-copper-dk));
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 12px rgba(212,130,58,0.35);
    transform: scale(1.08);
  }
  .book-cart-btn.disabled {
    opacity: 0.35; cursor: not-allowed; pointer-events: none;
  }

  /* Detail link at bottom */
  .book-detail-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    text-decoration: none;
    background: var(--bc-bg-soft);
    border-top: 1px solid var(--bc-border);
    color: var(--bc-ink2);
    font-family: 'Poppins', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.65rem 1rem;
    cursor: pointer;
    transition: all 0.22s;
    border-radius: 0 0 12px 12px;
  }
  .book-detail-btn:hover {
    background: var(--bc-navy);
    color: #fff;
  }
  .book-detail-btn:hover svg { color: var(--bc-copper-lt); }
`

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

let injected = false

const BookCard = ({ book }) => {
  const { addToCart } = useCart()

  if (!injected) {
    const tag = document.createElement('style')
    tag.textContent = styles
    document.head.appendChild(tag)
    injected = true
  }

  const inStock = book.stock > 0

  return (
    <article className="book-card">

      {/* Cover */}
      <div className="book-cover-wrap">
        {book.category?.name && (
          <span className="book-badge">{book.category.name}</span>
        )}
        {!inStock && (
          <span className="book-badge-stock">Habis</span>
        )}

        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="book-cover-img" loading="lazy" />
        ) : (
          <div className="book-cover-placeholder">
            <BookOpen size={30} />
            <div className="book-cover-placeholder-title">{book.title}</div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="book-overlay">
          <Link to={`/books/${book.id}`} className="overlay-btn overlay-btn-secondary">
            <Eye size={13} /> Lihat Detail
          </Link>
          {inStock ? (
            <button className="overlay-btn overlay-btn-primary" onClick={() => addToCart(book.id, 1)}>
              <ShoppingCart size={13} /> Tambah ke Keranjang
            </button>
          ) : (
            <span className="overlay-btn overlay-btn-disabled">Stok Habis</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="book-body">
        {book.category?.name && (
          <div className="book-category-text">{book.category.name}</div>
        )}
        <Link to={`/books/${book.id}`} className="book-title">{book.title}</Link>
        <div className="book-author">{book.author}</div>
      </div>

      {/* Footer */}
      <div className="book-footer">
        <div>
          <div className="book-price-label">Harga</div>
          <div className="book-price">{formatPrice(book.price)}</div>
        </div>
        <button
          className={`book-cart-btn ${!inStock ? 'disabled' : ''}`}
          onClick={() => inStock && addToCart(book.id, 1)}
          title="Tambah ke Keranjang"
          disabled={!inStock}
        >
          <ShoppingCart size={15} />
        </button>
      </div>

      {/* Detail link */}
      <Link to={`/books/${book.id}`} className="book-detail-btn">
        <Eye size={12} /> Lihat Detail Buku
      </Link>

    </article>
  )
}

export default BookCard