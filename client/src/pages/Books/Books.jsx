import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, BookOpen, ArrowRight, ChevronRight } from 'lucide-react'
import BookCard from '../../components/Books/BookCard'
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

  .books-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ PAGE HEADER ══ */
  .books-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, var(--navy-lt) 100%);
    padding: 3rem clamp(1.5rem, 6vw, 5rem) 3rem;
    position: relative;
    overflow: hidden;
  }
  .books-header::before {
    content: 'KATALOG';
    position: absolute;
    right: clamp(1rem, 5vw, 4rem);
    bottom: -0.5rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(4rem, 12vw, 9rem);
    font-weight: 900;
    color: rgba(255,255,255,0.03);
    letter-spacing: -0.02em;
    line-height: 1;
    pointer-events: none; user-select: none;
  }
  .books-header::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 50% 80% at 80% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .books-header-inner { position: relative; z-index: 1; }

  .books-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 0.7rem;
  }
  .books-header-eyebrow::before {
    content: ''; display: block;
    width: 2rem; height: 1px; background: var(--copper-lt);
  }

  .books-header-title {
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .books-header-title em { font-style: italic; color: var(--copper-lt); }

  /* Breadcrumb */
  .books-breadcrumb {
    display: flex; align-items: center; gap: 0.4rem;
    margin-top: 1.2rem;
    font-size: 0.72rem; color: rgba(200,215,255,0.45);
  }
  .books-breadcrumb a { color: rgba(200,215,255,0.55); text-decoration: none; transition: color 0.2s; }
  .books-breadcrumb a:hover { color: var(--copper-lt); }
  .books-breadcrumb svg { flex-shrink: 0; }

  /* ══ SEARCH BAR ══ */
  .search-wrap {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 1rem clamp(1.5rem, 6vw, 5rem);
    display: flex; align-items: center; gap: 0.75rem;
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
    position: sticky; top: 66px; z-index: 90;
  }

  .search-form {
    flex: 1; position: relative;
  }
  .search-input {
    width: 100%;
    background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--navy);
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem; font-weight: 400;
    padding: 0.72rem 1rem 0.72rem 2.8rem;
    outline: none; border-radius: 9px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .search-input::placeholder { color: var(--ink4); }
  .search-input:focus {
    background: var(--bg-card);
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .search-icon {
    position: absolute; left: 0.9rem; top: 50%;
    transform: translateY(-50%);
    color: var(--ink4); pointer-events: none;
    transition: color 0.2s;
  }
  .search-form:focus-within .search-icon { color: var(--copper); }

  .search-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    padding: 0.72rem 1.4rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(15,30,66,0.2);
  }
  .search-btn:hover {
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    box-shadow: 0 4px 14px rgba(212,130,58,0.35);
  }

  .filter-toggle-btn {
    display: none;
    align-items: center; gap: 0.5rem;
    background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--ink2);
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem; font-weight: 600;
    padding: 0.72rem 1.1rem; cursor: pointer;
    border-radius: 9px; white-space: nowrap; flex-shrink: 0;
    transition: all 0.22s;
  }
  .filter-toggle-btn:hover { border-color: var(--copper); background: var(--copper-pale); color: var(--copper-dk); }
  @media (max-width: 900px) { .filter-toggle-btn { display: inline-flex; } }

  /* ══ LAYOUT ══ */
  .books-layout {
    display: grid;
    grid-template-columns: 256px 1fr;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 80vh;
  }
  @media (max-width: 900px) { .books-layout { grid-template-columns: 1fr; } }

  /* ══ SIDEBAR ══ */
  .books-sidebar {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    padding: 1.8rem 1.25rem;
    position: sticky;
    top: calc(66px + 57px);
    height: calc(100vh - 66px - 57px);
    overflow-y: auto;
  }
  @media (max-width: 900px) {
    .books-sidebar {
      position: fixed; top: 0; left: 0;
      width: min(300px, 85vw); height: 100vh;
      z-index: 200;
      transform: translateX(-110%);
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
      padding-top: 3.5rem; box-shadow: none;
    }
    .books-sidebar.open {
      transform: translateX(0);
      box-shadow: 8px 0 40px rgba(15,30,66,0.15);
    }
  }

  .sidebar-overlay {
    display: none;
  }
  @media (max-width: 900px) {
    .sidebar-overlay {
      display: block; position: fixed; inset: 0;
      background: rgba(15,30,66,0.4);
      backdrop-filter: blur(2px);
      z-index: 199;
      animation: fadeIn 0.2s ease;
    }
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .sidebar-close {
    display: none;
    position: absolute; top: 1rem; right: 1rem;
    background: var(--bg-soft); border: 1px solid var(--border);
    cursor: pointer; color: var(--ink3);
    padding: 0; width: 30px; height: 30px;
    align-items: center; justify-content: center;
    border-radius: 7px; transition: all 0.2s;
  }
  .sidebar-close:hover { background: var(--bg-mid); color: var(--navy); }
  @media (max-width: 900px) { .sidebar-close { display: flex; } }

  .sidebar-title {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-bottom: 0.9rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .sidebar-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .filter-btn {
    width: 100%; text-align: left;
    background: none; border: none; cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 0.83rem; font-weight: 400;
    color: var(--ink3);
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 2px;
  }
  .filter-btn:hover { background: var(--bg-soft); color: var(--navy); }
  .filter-btn.active {
    background: var(--navy);
    color: #fff; font-weight: 600;
  }
  .filter-btn.active .filter-count { color: var(--copper-lt); }
  .filter-count {
    font-size: 0.7rem; color: var(--ink4);
    background: var(--bg-soft);
    padding: 0.1rem 0.5rem; border-radius: 100px;
    font-weight: 500;
  }
  .filter-btn.active .filter-count {
    background: rgba(255,255,255,0.12);
    color: var(--copper-lt);
  }

  /* ══ MAIN ══ */
  .books-main {
    padding: 2rem clamp(1.5rem, 4vw, 2.5rem);
  }

  .books-meta {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1.1rem;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap; gap: 0.75rem;
  }
  .books-count {
    font-size: 0.8rem; color: var(--ink3);
  }
  .books-count strong { font-weight: 700; color: var(--navy); font-size: 0.95rem; }

  .filter-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .active-filter-tag {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: var(--navy-pale);
    border: 1px solid rgba(15,30,66,0.15);
    color: var(--navy);
    font-size: 0.72rem; font-weight: 600;
    padding: 0.28rem 0.65rem;
    border-radius: 100px;
  }
  .active-filter-tag button {
    background: none; border: none; cursor: pointer;
    color: var(--ink4); padding: 0;
    display: flex; align-items: center; transition: color 0.15s;
    margin-left: 1px;
  }
  .active-filter-tag button:hover { color: var(--navy); }

  /* ══ BOOKS GRID ══ */
  .books-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  @media (max-width: 1200px) { .books-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 500px)  { .books-grid { grid-template-columns: 1fr; } }

  /* ══ SKELETON ══ */
  .skeleton-card {
    background: var(--bg-mid);
    border-radius: 12px;
    height: 360px;
    position: relative; overflow: hidden;
  }
  .skeleton-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* ══ EMPTY STATE ══ */
  .books-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 5rem 2rem;
    background: var(--bg-card);
    border-radius: 14px;
    border: 1px solid var(--border);
  }
  .books-empty-icon {
    width: 68px; height: 68px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.4rem;
    color: var(--ink4);
  }
  .books-empty-title {
    font-size: 1.2rem; font-weight: 700;
    color: var(--navy); margin-bottom: 0.5rem;
  }
  .books-empty-desc { font-size: 0.85rem; color: var(--ink3); line-height: 1.6; }
`

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks]               = useState([])
  const [categories, setCategories]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sidebarOpen, setSidebarOpen]   = useState(false)

  useEffect(() => { fetchBooks(); fetchCategories() }, [searchParams])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(searchParams)
      const { data } = await api.get(`/books?${params.toString()}`)
      setBooks(data.books)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategories(data)
    } catch (e) { console.error(e) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) params.set('q', search); else params.delete('q')
    setSearchParams(params)
  }

  const handleCategory = (catId) => {
    const params = new URLSearchParams(searchParams)
    if (catId === selectedCategory) { params.delete('category'); setSelectedCategory('') }
    else { params.set('category', catId); setSelectedCategory(catId) }
    setSearchParams(params); setSidebarOpen(false)
  }

  const clearSearch = () => {
    setSearch('')
    const params = new URLSearchParams(searchParams)
    params.delete('q'); setSearchParams(params)
  }

  const activeCatName = categories.find(c => c.id === selectedCategory)?.name
  const activeQuery   = searchParams.get('q')

  return (
    <div className="books-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="books-header">
        <div className="books-header-inner">
          <div className="books-header-eyebrow">Koleksi Kami</div>
          <h1 className="books-header-title">
            Temukan <em>Buku</em> yang<br />Tepat Untukmu
          </h1>
          <div className="books-breadcrumb">
            <a href="/">Beranda</a>
            <ChevronRight size={12} />
            <span>Katalog Buku</span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-wrap">
        <form onSubmit={handleSearch} className="search-form" id="search-form">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari judul, penulis, atau ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </form>
        <button type="submit" form="search-form" className="search-btn" onClick={handleSearch}>
          Cari <ArrowRight size={13} />
        </button>
        <button className="filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
          <SlidersHorizontal size={14} /> Filter
        </button>
      </div>

      {/* LAYOUT */}
      <div className="books-layout">

        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`books-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={15} />
          </button>

          <div className="sidebar-title">Kategori</div>

          <div>
            <button
              onClick={() => handleCategory('')}
              className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            >
              Semua Buku
              <span className="filter-count">{books.length}</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name}
                <span className="filter-count">{cat._count?.books || 0}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="books-main">
          <div className="books-meta">
            <div className="books-count">
              Menampilkan <strong>{books.length}</strong> buku
            </div>
            <div className="filter-tags">
              {activeCatName && (
                <span className="active-filter-tag">
                  {activeCatName}
                  <button onClick={() => handleCategory(selectedCategory)}><X size={10} /></button>
                </span>
              )}
              {activeQuery && (
                <span className="active-filter-tag">
                  "{activeQuery}"
                  <button onClick={clearSearch}><X size={10} /></button>
                </span>
              )}
            </div>
          </div>

          <div className="books-grid">
            {loading ? (
              [...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)
            ) : books.length > 0 ? (
              books.map(book => <BookCard key={book.id} book={book} />)
            ) : (
              <div className="books-empty">
                <div className="books-empty-icon"><BookOpen size={28} /></div>
                <div className="books-empty-title">Buku Tidak Ditemukan</div>
                <div className="books-empty-desc">
                  Coba gunakan kata kunci yang berbeda<br />atau hapus filter yang aktif.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Books