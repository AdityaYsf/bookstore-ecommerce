import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, BookOpen, AlertTriangle, Check } from 'lucide-react'
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

  .ab-root {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--navy);
    min-height: 100vh;
  }

  /* ══ HEADER ══ */
  .ab-header {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 55%, var(--navy-lt) 100%);
    padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 2.25rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
    position: relative; overflow: hidden;
  }
  .ab-header::before {
    content: 'BUKU';
    position: absolute; right: clamp(1rem, 4vw, 3rem); bottom: -0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
    color: rgba(255,255,255,0.03); letter-spacing: -0.02em;
    line-height: 1; pointer-events: none; user-select: none;
  }
  .ab-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 45% 80% at 85% 50%, rgba(212,130,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .ab-header-left { position: relative; z-index: 2; }
  .ab-header-eyebrow {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--copper-lt); margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .ab-header-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: var(--copper-lt); }

  .ab-header-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800; color: #fff; line-height: 1.1;
  }
  .ab-header-title em { font-style: italic; color: var(--copper-lt); }

  .ab-add-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    border: none; cursor: pointer;
    padding: 0.72rem 1.4rem; border-radius: 9px;
    transition: all 0.22s; white-space: nowrap; flex-shrink: 0;
    position: relative; z-index: 2;
    box-shadow: 0 4px 14px rgba(212,130,58,0.4);
  }
  .ab-add-btn:hover { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,130,58,0.5); }

  /* ══ TOOLBAR ══ */
  .ab-toolbar {
    padding: 1rem clamp(1.5rem, 5vw, 4rem);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
    position: sticky; top: 66px; z-index: 89;
  }
  .ab-search-wrap { position: relative; flex: 1; max-width: 360px; }
  .ab-search-icon {
    position: absolute; left: 0.9rem; top: 50%;
    transform: translateY(-50%); color: var(--ink4); pointer-events: none;
    transition: color 0.2s;
  }
  .ab-search-wrap:focus-within .ab-search-icon { color: var(--copper); }
  .ab-search-input {
    width: 100%; background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--navy); font-family: 'Poppins', sans-serif;
    font-size: 0.85rem; padding: 0.68rem 1rem 0.68rem 2.75rem;
    border-radius: 9px; outline: none;
    transition: all 0.2s; box-sizing: border-box;
  }
  .ab-search-input::placeholder { color: var(--ink4); }
  .ab-search-input:focus {
    background: var(--bg-card);
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  .ab-count { font-size: 0.78rem; color: var(--ink3); }
  .ab-count strong { color: var(--navy); font-weight: 700; }

  /* ══ MAIN ══ */
  .ab-main {
    padding: 1.75rem clamp(1.5rem, 5vw, 4rem);
    max-width: 1400px; margin: 0 auto;
  }

  /* ══ TABLE ══ */
  .ab-table-wrap {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  .ab-table-scroll { overflow-x: auto; }
  .ab-table { width: 100%; border-collapse: collapse; }

  .ab-table thead tr {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
  }
  .ab-table thead th {
    padding: 0.9rem 1.2rem;
    text-align: left;
    font-size: 0.62rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(200,215,255,0.55); white-space: nowrap;
  }
  .ab-table thead th:last-child { text-align: right; }

  .ab-table tbody tr {
    border-bottom: 1px solid var(--border-lt);
    transition: background 0.15s;
  }
  .ab-table tbody tr:last-child { border-bottom: none; }
  .ab-table tbody tr:hover { background: var(--bg-soft); }

  .ab-table td {
    padding: 0.95rem 1.2rem;
    font-size: 0.84rem; color: var(--navy);
    vertical-align: middle;
  }

  /* Book cell */
  .ab-book-cell { display: flex; align-items: center; gap: 0.85rem; }
  .ab-book-cover {
    width: 38px; height: 52px;
    object-fit: cover; border-radius: 5px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(15,30,66,0.15);
  }
  .ab-book-cover-placeholder {
    width: 38px; height: 52px;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4); flex-shrink: 0; border-radius: 5px;
  }
  .ab-book-title {
    font-weight: 600; color: var(--navy);
    font-size: 0.84rem; line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .ab-book-author { font-size: 0.72rem; color: var(--ink3); margin-top: 0.12rem; }

  /* Price */
  .ab-price { font-weight: 800; font-size: 0.88rem; color: var(--navy); }

  /* Stock pill */
  .ab-stock-pill {
    display: inline-flex; align-items: center; gap: 0.32rem;
    font-size: 0.68rem; font-weight: 700;
    padding: 0.22rem 0.65rem; border-radius: 100px;
  }
  .ab-stock-pill.ok  { background: var(--green-pale); color: var(--green); }
  .ab-stock-pill.low { background: #fff5f5; color: #dc2626; }
  .ab-stock-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Category */
  .ab-category {
    font-size: 0.7rem; color: var(--ink2); font-weight: 500;
    background: var(--navy-pale);
    padding: 0.2rem 0.65rem; border-radius: 100px;
    display: inline-block;
  }

  /* Actions */
  .ab-actions-cell { text-align: right; white-space: nowrap; }
  .ab-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    border: 1.5px solid var(--border);
    background: var(--bg-soft); cursor: pointer;
    transition: all 0.2s;
  }
  .ab-action-btn.edit { color: var(--ink3); margin-right: 0.4rem; }
  .ab-action-btn.edit:hover { border-color: rgba(212,130,58,0.4); background: var(--copper-pale); color: var(--copper-dk); }
  .ab-action-btn.del  { color: var(--ink3); }
  .ab-action-btn.del:hover  { border-color: rgba(220,38,38,0.3); background: #fff5f5; color: #dc2626; }

  /* Empty */
  .ab-empty {
    padding: 4.5rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.65rem;
  }
  .ab-empty-icon {
    width: 58px; height: 58px; background: var(--bg-soft);
    border: 1px solid var(--border); border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink4); margin-bottom: 0.2rem;
  }
  .ab-empty-title { font-size: 1rem; font-weight: 700; color: var(--ink2); }
  .ab-empty-desc  { font-size: 0.78rem; color: var(--ink4); }

  /* Skeleton */
  .ab-skeleton-row td { padding: 0.95rem 1.2rem; }
  .ab-skeleton-bar {
    background: var(--bg-mid); border-radius: 6px; height: 13px;
    position: relative; overflow: hidden;
  }
  .ab-skeleton-bar::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  /* ══ MODAL OVERLAY ══ */
  .ab-overlay {
    position: fixed; inset: 0;
    background: rgba(15,30,66,0.5);
    backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; z-index: 200;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  /* ══ MODAL ══ */
  .ab-modal {
    background: var(--bg-card);
    width: 100%; max-width: 680px;
    max-height: 92svh;
    display: flex; flex-direction: column;
    border-radius: 16px;
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1);
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(15,30,66,0.2);
    overflow: hidden;
  }
  @keyframes modalIn {
    from{opacity:0;transform:translateY(20px) scale(0.98)}
    to  {opacity:1;transform:translateY(0)    scale(1)}
  }

  .ab-modal-header {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    padding: 1.4rem 1.75rem;
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .ab-modal-header::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,130,58,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .ab-modal-title {
    font-size: 1.05rem; font-weight: 700; color: #fff;
    position: relative; z-index: 1;
  }
  .ab-modal-title em { font-style: italic; color: var(--copper-lt); }

  .ab-modal-close {
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px; cursor: pointer;
    color: rgba(200,215,255,0.6);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; position: relative; z-index: 1;
  }
  .ab-modal-close:hover { background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.3); color: #fca5a5; }

  .ab-modal-body { padding: 1.6rem 1.75rem; overflow-y: auto; flex: 1; }

  /* Form */
  .ab-form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  }
  @media (max-width: 540px) { .ab-form-grid { grid-template-columns: 1fr; } }
  .ab-col-2 { grid-column: 1 / -1; }

  .ab-form-section {
    grid-column: 1 / -1;
    font-size: 0.63rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--copper-dk); margin-top: 0.5rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .ab-form-section::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .ab-label {
    display: block; font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink2); margin-bottom: 0.38rem;
  }
  .ab-input {
    width: 100%; background: var(--bg-soft);
    border: 1.5px solid var(--border);
    color: var(--navy); font-family: 'Poppins', sans-serif;
    font-size: 0.87rem; padding: 0.72rem 0.9rem;
    border-radius: 9px; outline: none;
    transition: all 0.2s; box-sizing: border-box;
  }
  .ab-input::placeholder { color: var(--ink4); }
  .ab-input:focus {
    background: var(--bg-card);
    border-color: var(--copper);
    box-shadow: 0 0 0 3px rgba(212,130,58,0.1);
  }
  textarea.ab-input { resize: vertical; min-height: 90px; line-height: 1.6; }
  select.ab-input { cursor: pointer; }

  /* Modal footer */
  .ab-modal-footer {
    padding: 1.1rem 1.75rem;
    border-top: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: flex-end; gap: 0.75rem;
    flex-shrink: 0; background: var(--bg-soft);
  }
  .ab-cancel-btn {
    display: inline-flex; align-items: center;
    background: var(--bg-card); border: 1.5px solid var(--border);
    color: var(--ink3); font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 500;
    cursor: pointer; padding: 0.62rem 1.2rem; border-radius: 8px;
    transition: all 0.2s;
  }
  .ab-cancel-btn:hover { border-color: var(--navy); color: var(--navy); background: var(--navy-pale); }

  .ab-save-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: linear-gradient(135deg, var(--navy), var(--navy-mid));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    border: none; cursor: pointer;
    padding: 0.68rem 1.4rem; border-radius: 8px;
    transition: all 0.25s;
    box-shadow: 0 3px 12px rgba(15,30,66,0.2);
    position: relative; overflow: hidden;
  }
  .ab-save-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    opacity: 0; transition: opacity 0.25s;
  }
  .ab-save-btn:hover::before { opacity: 1; }
  .ab-save-btn:hover { box-shadow: 0 6px 18px rgba(212,130,58,0.4); transform: translateY(-1px); }
  .ab-save-btn > * { position: relative; z-index: 1; }

  /* ══ CONFIRM ══ */
  .ab-confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(15,30,66,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; z-index: 300;
    animation: fadeIn 0.15s ease;
  }
  .ab-confirm-box {
    background: var(--bg-card); padding: 2rem;
    max-width: 380px; width: 100%; border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: 0 20px 50px rgba(15,30,66,0.2);
    animation: modalIn 0.2s ease;
    text-align: center;
  }
  .ab-confirm-icon {
    width: 52px; height: 52px;
    background: #fff5f5; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #dc2626; margin: 0 auto 1.2rem;
  }
  .ab-confirm-title { font-size: 1.05rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .ab-confirm-desc { font-size: 0.82rem; color: var(--ink3); margin-bottom: 1.6rem; line-height: 1.65; }
  .ab-confirm-btns { display: flex; gap: 0.75rem; justify-content: center; }
  .ab-confirm-cancel {
    padding: 0.65rem 1.4rem;
    border: 1.5px solid var(--border); background: var(--bg-soft);
    color: var(--ink2); font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    border-radius: 8px; transition: all 0.2s;
  }
  .ab-confirm-cancel:hover { border-color: var(--navy); color: var(--navy); background: var(--navy-pale); }
  .ab-confirm-delete {
    padding: 0.65rem 1.4rem;
    background: #dc2626; color: #fff;
    border: none; font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    cursor: pointer; border-radius: 8px;
    transition: all 0.2s; box-shadow: 0 3px 10px rgba(220,38,38,0.3);
  }
  .ab-confirm-delete:hover { background: #b91c1c; box-shadow: 0 5px 14px rgba(220,38,38,0.4); transform: translateY(-1px); }
`

const formatPrice = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const emptyForm = {
  title: '', author: '', price: '', stock: '',
  description: '', categoryId: '', isbn: '', publisher: '', year: ''
}

const AdminBooks = () => {
  const [books, setBooks]               = useState([])
  const [categories, setCategories]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [editingBook, setEditingBook]   = useState(null)
  const [searchQuery, setSearchQuery]   = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [formData, setFormData]         = useState(emptyForm)

  useEffect(() => { fetchBooks(); fetchCategories() }, [])

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books?limit=100')
      setBooks(data.books)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try { const { data } = await api.get('/categories'); setCategories(data) }
    catch (e) { console.error(e) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBook) await api.put(`/books/${editingBook.id}`, formData)
      else             await api.post('/books', formData)
      setShowModal(false); setEditingBook(null); setFormData(emptyForm); fetchBooks()
    } catch (err) { alert(err.response?.data?.message || 'Terjadi kesalahan') }
  }

  const handleDelete = async () => {
    try { await api.delete(`/books/${confirmDeleteId}`); setConfirmDeleteId(null); fetchBooks() }
    catch { alert('Gagal menghapus buku') }
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title, author: book.author,
      price: book.price, stock: book.stock,
      description: book.description || '', categoryId: book.categoryId || '',
      isbn: book.isbn || '', publisher: book.publisher || '', year: book.year || ''
    })
    setShowModal(true)
  }

  const openAdd = () => { setEditingBook(null); setFormData(emptyForm); setShowModal(true) }
  const set = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }))

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="ab-root">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="ab-header">
        <div className="ab-header-left">
          <div className="ab-header-eyebrow">Panel Admin</div>
          <h1 className="ab-header-title">Manajemen <em>Buku</em></h1>
        </div>
        <button className="ab-add-btn" onClick={openAdd}>
          <Plus size={14} /> Tambah Buku
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="ab-toolbar">
        <div className="ab-search-wrap">
          <Search size={15} className="ab-search-icon" />
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="ab-search-input"
          />
        </div>
        <span className="ab-count"><strong>{filteredBooks.length}</strong> buku ditemukan</span>
      </div>

      {/* MAIN */}
      <div className="ab-main">
        <div className="ab-table-wrap">
          <div className="ab-table-scroll">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Buku</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Kategori</th>
                  <th style={{textAlign:'right'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="ab-skeleton-row">
                      <td>
                        <div style={{display:'flex',gap:'0.85rem',alignItems:'center'}}>
                          <div style={{width:38,height:52,background:'var(--bg-mid)',borderRadius:5,flexShrink:0}} />
                          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                            <div className="ab-skeleton-bar" style={{width:'70%'}} />
                            <div className="ab-skeleton-bar" style={{width:'45%',height:10}} />
                          </div>
                        </div>
                      </td>
                      {[1,2,3,4].map(j => (
                        <td key={j}><div className="ab-skeleton-bar" style={{width:'60%'}} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredBooks.length === 0 ? (
                  <tr><td colSpan={5}>
                    <div className="ab-empty">
                      <div className="ab-empty-icon"><BookOpen size={26} /></div>
                      <div className="ab-empty-title">Tidak Ada Buku</div>
                      <div className="ab-empty-desc">
                        {searchQuery ? `Tidak ditemukan hasil untuk "${searchQuery}"` : 'Tambahkan buku pertama kamu'}
                      </div>
                    </div>
                  </td></tr>
                ) : filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>
                      <div className="ab-book-cell">
                        {book.coverImage
                          ? <img src={book.coverImage} alt={book.title} className="ab-book-cover" />
                          : <div className="ab-book-cover-placeholder"><BookOpen size={15} /></div>
                        }
                        <div>
                          <div className="ab-book-title">{book.title}</div>
                          <div className="ab-book-author">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="ab-price">{formatPrice(book.price)}</span></td>
                    <td>
                      <span className={`ab-stock-pill ${book.stock < 5 ? 'low' : 'ok'}`}>
                        <span className="ab-stock-pill-dot" />{book.stock}
                      </span>
                    </td>
                    <td>
                      {book.category?.name
                        ? <span className="ab-category">{book.category.name}</span>
                        : <span style={{color:'var(--ink4)'}}>—</span>
                      }
                    </td>
                    <td className="ab-actions-cell">
                      <button className="ab-action-btn edit" onClick={() => handleEdit(book)} title="Edit"><Edit2 size={13} /></button>
                      <button className="ab-action-btn del"  onClick={() => setConfirmDeleteId(book.id)} title="Hapus"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ MODAL ══ */}
      {showModal && (
        <div className="ab-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="ab-modal">
            <div className="ab-modal-header">
              <div className="ab-modal-title">
                {editingBook ? <>Edit <em>Buku</em></> : <>Tambah <em>Buku Baru</em></>}
              </div>
              <button className="ab-modal-close" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>

            <div className="ab-modal-body">
              <form id="book-form" onSubmit={handleSubmit}>
                <div className="ab-form-grid">

                  <div className="ab-form-section">Info Utama</div>

                  <div className="ab-field ab-col-2">
                    <label className="ab-label">Judul Buku *</label>
                    <input required value={formData.title} onChange={set('title')} className="ab-input" placeholder="Masukkan judul buku" />
                  </div>
                  <div className="ab-field">
                    <label className="ab-label">Penulis *</label>
                    <input required value={formData.author} onChange={set('author')} className="ab-input" placeholder="Nama penulis" />
                  </div>
                  <div className="ab-field">
                    <label className="ab-label">Kategori</label>
                    <select value={formData.categoryId} onChange={set('categoryId')} className="ab-input">
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>

                  <div className="ab-form-section">Harga & Stok</div>

                  <div className="ab-field">
                    <label className="ab-label">Harga (Rp) *</label>
                    <input type="number" required value={formData.price} onChange={set('price')} className="ab-input" placeholder="0" min="0" />
                  </div>
                  <div className="ab-field">
                    <label className="ab-label">Stok *</label>
                    <input type="number" required value={formData.stock} onChange={set('stock')} className="ab-input" placeholder="0" min="0" />
                  </div>

                  <div className="ab-form-section">Detail Penerbitan</div>

                  <div className="ab-field">
                    <label className="ab-label">ISBN</label>
                    <input value={formData.isbn} onChange={set('isbn')} className="ab-input" placeholder="978-xxx-xxx" />
                  </div>
                  <div className="ab-field">
                    <label className="ab-label">Tahun Terbit</label>
                    <input type="number" value={formData.year} onChange={set('year')} className="ab-input" placeholder="2024" min="1900" max="2099" />
                  </div>
                  <div className="ab-field ab-col-2">
                    <label className="ab-label">Penerbit</label>
                    <input value={formData.publisher} onChange={set('publisher')} className="ab-input" placeholder="Nama penerbit" />
                  </div>

                  <div className="ab-form-section">Deskripsi</div>

                  <div className="ab-field ab-col-2">
                    <label className="ab-label">Deskripsi Buku</label>
                    <textarea value={formData.description} onChange={set('description')} className="ab-input" placeholder="Tulis sinopsis atau deskripsi singkat..." rows={4} />
                  </div>

                </div>
              </form>
            </div>

            <div className="ab-modal-footer">
              <button className="ab-cancel-btn" type="button" onClick={() => setShowModal(false)}>Batal</button>
              <button className="ab-save-btn" type="submit" form="book-form">
                <Check size={13} />
                {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRM DELETE ══ */}
      {confirmDeleteId && (
        <div className="ab-confirm-overlay" onClick={e => e.target === e.currentTarget && setConfirmDeleteId(null)}>
          <div className="ab-confirm-box">
            <div className="ab-confirm-icon"><AlertTriangle size={22} /></div>
            <div className="ab-confirm-title">Hapus Buku?</div>
            <div className="ab-confirm-desc">
              Tindakan ini tidak dapat dibatalkan. Buku akan dihapus secara permanen dari sistem.
            </div>
            <div className="ab-confirm-btns">
              <button className="ab-confirm-cancel" onClick={() => setConfirmDeleteId(null)}>Batal</button>
              <button className="ab-confirm-delete" onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBooks