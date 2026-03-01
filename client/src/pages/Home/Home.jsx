import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Truck, Shield, Headphones,
  ChevronRight, Tag, Sparkles, Star
} from 'lucide-react'
import BookCard from '../../components/Books/BookCard'
import api from '../../services/api'
import HeroMain from './components/hero-books.png'
import HeroSec from './components/hero-books-2.png'
import { useAuth } from '../../context/AuthContext' // ← import auth context

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --bg-page:   #f5f7ff;
    --bg-card:   #ffffff;
    --bg-soft:   #eef1fb;
    --bg-mid:    #e4e9f7;
    --navy:      #0f1e42;
    --navy-mid:  #1a2f5e;
    --navy-lt:   #253a6e;
    --navy-pale: #dde4f5;
    --copper:      #d4823a;
    --copper-dk:   #b06828;
    --copper-lt:   #e89a58;
    --copper-pale: #fdecd8;
    --ink:    #0f1e42;
    --ink-2:  #3a4a6e;
    --ink-3:  #6272a0;
    --ink-4:  #9aa3c2;
    --bdr:     rgba(15,30,66,0.1);
    --bdr-lt:  rgba(15,30,66,0.06);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hr {
    font-family: 'Poppins', sans-serif;
    background: var(--bg-page);
    color: var(--ink);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ══ PROMO BAR ══ */
  .promo-bar {
    background: linear-gradient(90deg, var(--copper-dk), var(--copper), var(--copper-dk));
    padding: 0.5rem 1rem;
    text-align: center;
    font-size: 0.76rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.02em;
    position: relative;
    overflow: hidden;
  }
  .promo-bar::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: shimmer 3s ease-in-out infinite;
  }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

  /* ══ HERO ══ */
  .hero {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, var(--navy-lt) 100%);
    padding: 3.5rem clamp(1.5rem, 6vw, 6rem);
    min-height: 460px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 55% 80% at 85% 50%, rgba(212,130,58,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 5% 20%,  rgba(255,255,255,0.04) 0%, transparent 55%);
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute; right: -100px; top: -100px;
    width: 450px; height: 450px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    pointer-events: none;
  }

  .hero-inner {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    width: 100%; max-width: 1200px; margin: 0 auto;
  }
  @media (max-width: 768px) {
    .hero-inner { grid-template-columns: 1fr; }
    .hero-right  { display: none; }
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.45rem;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    color: var(--copper-pale);
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.3rem 0.85rem; border-radius: 100px;
    margin-bottom: 1.1rem; width: fit-content;
    animation: fsu 0.6s 0.1s ease both;
  }
  .badge-dot { width: 5px; height: 5px; background: var(--copper-lt); border-radius: 50%; animation: blink 1.5s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hero-title {
    font-size: clamp(2rem, 4.5vw, 3.6rem);
    font-weight: 800; line-height: 1.1;
    color: #fff; margin-bottom: 1rem;
    animation: fsu 0.7s 0.2s ease both;
  }
  .hero-title .hl {
    color: var(--copper-lt);
    position: relative; display: inline-block;
  }
  .hero-title .hl::after {
    content: '';
    position: absolute; bottom: 2px; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--copper-lt), transparent);
    border-radius: 2px;
  }

  .hero-desc {
    font-size: 0.93rem; font-weight: 400; line-height: 1.75;
    color: rgba(220,228,255,0.75); max-width: 42ch;
    margin-bottom: 2rem;
    animation: fsu 0.7s 0.3s ease both;
  }

  .hero-ctas {
    display: flex; gap: 1rem; flex-wrap: wrap;
    animation: fsu 0.7s 0.4s ease both;
  }

  .btn-copper {
    display: inline-flex; align-items: center; gap: 0.55rem;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-weight: 600; font-size: 0.875rem;
    padding: 0.75rem 1.75rem; border-radius: 8px;
    text-decoration: none; transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(212,130,58,0.4);
  }
  .btn-copper:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,130,58,0.55); filter: brightness(1.08); }

  .btn-ghost-w {
    display: inline-flex; align-items: center; gap: 0.55rem;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.22);
    color: rgba(255,255,255,0.85);
    font-family: 'Poppins', sans-serif;
    font-weight: 500; font-size: 0.875rem;
    padding: 0.75rem 1.75rem; border-radius: 8px;
    text-decoration: none; transition: all 0.25s;
  }
  .btn-ghost-w:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }

  .hero-stats {
    display: flex; gap: 2rem;
    margin-top: 2.5rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.12);
    animation: fsu 0.7s 0.5s ease both;
  }
  .hs-num { font-size: 1.55rem; font-weight: 800; color: #fff; line-height: 1; }
  .hs-num em { color: var(--copper-lt); font-style: normal; font-size: 0.95rem; }
  .hs-lbl { font-size: 0.68rem; font-weight: 500; color: rgba(200,215,255,0.55); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.2rem; }

  .hero-right {
    display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto;
    gap: 12px;
    animation: fsu 0.9s 0.3s ease both;
  }
  .hb-main {
    grid-row: span 2; border-radius: 10px; overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06);
    transform: perspective(600px) rotateY(-5deg);
    transition: transform 0.6s ease;
  }
  .hb-main:hover { transform: perspective(600px) rotateY(0deg); }
  .hb-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hb-sm { border-radius: 8px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
  .hb-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hb-promo {
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    border-radius: 8px; padding: 1.2rem;
    display: flex; flex-direction: column; justify-content: center;
    box-shadow: 0 12px 28px rgba(212,130,58,0.35);
  }
  .hbp-lbl { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.72); margin-bottom: 0.3rem; }
  .hbp-num { font-size: 2.6rem; font-weight: 900; color: #fff; line-height: 1; }
  .hbp-sub { font-size: 0.72rem; color: rgba(255,255,255,0.85); margin-top: 0.2rem; }

  /* ══ TICKER ══ */
  .ticker { background: var(--navy); overflow: hidden; border-bottom: 3px solid var(--copper); }
  .ticker-track { display: flex; animation: tick 28s linear infinite; width: max-content; }
  .t-item {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 0.72rem 1.6rem;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,215,255,0.65); white-space: nowrap;
  }
  .t-sep { color: var(--copper-lt); font-size: 0.5rem; }
  @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* ══ CHIPS ══ */
  .chips-wrap {
    padding: 1.4rem clamp(1.5rem, 6vw, 6rem);
    background: var(--bg-card);
    border-bottom: 1px solid var(--bdr);
    box-shadow: 0 2px 12px rgba(15,30,66,0.06);
  }
  .chips-row {
    display: flex; gap: 0.6rem; overflow-x: auto;
    scrollbar-width: none; -ms-overflow-style: none;
    max-width: 1200px; margin: 0 auto;
  }
  .chips-row::-webkit-scrollbar { display: none; }
  .chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.42rem 1rem; border-radius: 100px;
    background: var(--bg-soft);
    border: 1px solid var(--bdr);
    color: var(--ink-2);
    font-size: 0.78rem; font-weight: 500;
    text-decoration: none; white-space: nowrap; flex-shrink: 0;
    transition: all 0.22s;
  }
  .chip:hover { background: var(--navy-pale); border-color: var(--navy); color: var(--navy); }
  .chip.active { background: var(--navy); border-color: var(--navy); color: #fff; box-shadow: 0 3px 10px rgba(15,30,66,0.2); }

  /* ══ SHARED SECTION ══ */
  .section { padding: 3rem clamp(1.5rem, 6vw, 6rem); }
  .sec-w  { background: var(--bg-page); }
  .sec-wh { background: var(--bg-card); }
  .inner  { max-width: 1200px; margin: 0 auto; }

  .sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .sec-head-l { display: flex; align-items: center; gap: 0.7rem; }
  .sec-ico {
    width: 2.1rem; height: 2.1rem; border-radius: 7px;
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  .sec-ttl { font-size: 1.1rem; font-weight: 700; color: var(--ink); }
  .sec-sub { font-size: 0.71rem; color: var(--ink-3); margin-top: 0.05rem; }

  .link-all {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.78rem; font-weight: 600;
    color: var(--copper-dk);
    text-decoration: none;
    padding: 0.38rem 0.9rem; border-radius: 6px;
    border: 1px solid rgba(212,130,58,0.35);
    transition: all 0.22s; white-space: nowrap;
  }
  .link-all:hover { background: var(--copper-pale); border-color: var(--copper); }

  .divider { height: 1px; background: var(--bdr-lt); margin: 0 clamp(1.5rem, 6vw, 6rem); }

  /* ══ BOOKS GRID ══ */
  .books-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem;
  }
  @media (max-width: 1024px) { .books-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .books-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .books-grid { grid-template-columns: 1fr; } }

  /* ══ PROMO STRIP ══ */
  .promo-strip {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, var(--navy-lt) 100%);
    border-radius: 14px; padding: 2.5rem 3rem;
    display: grid; grid-template-columns: 1fr auto;
    align-items: center; gap: 2rem;
    position: relative; overflow: hidden;
    max-width: 1200px; margin: 0 auto;
    box-shadow: 0 8px 32px rgba(15,30,66,0.15);
  }
  @media (max-width: 600px) { .promo-strip { grid-template-columns: 1fr; padding: 2rem; } }
  .promo-strip::before {
    content: '';
    position: absolute; right: -60px; top: -60px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,130,58,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .ps-lbl { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--copper-lt); margin-bottom: 0.5rem; }
  .ps-ttl { font-size: clamp(1.3rem, 2.2vw, 1.9rem); font-weight: 800; color: #fff; line-height: 1.25; position: relative; z-index: 1; }
  .ps-ttl em { color: var(--copper-pale); font-style: normal; }

  /* ══ CATEGORIES ══ */
  .cat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .cat-grid { grid-template-columns: 1fr; } }

  .cat-card {
    position: relative; border-radius: 10px; overflow: hidden;
    text-decoration: none; display: block; aspect-ratio: 16/9;
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    box-shadow: 0 2px 8px rgba(15,30,66,0.06);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,30,66,0.14); }

  .cat-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--navy-pale) 0%, var(--bg-mid) 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .cat-num-bg {
    font-size: 5rem; font-weight: 900;
    color: rgba(15,30,66,0.06);
    position: absolute; right: 0.5rem; bottom: -0.5rem;
    line-height: 1; transition: color 0.3s;
  }
  .cat-card:hover .cat-num-bg { color: rgba(212,130,58,0.1); }

  .cat-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,30,66,0.82) 0%, rgba(15,30,66,0.2) 55%, transparent 100%);
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 0.9rem 1.1rem;
  }
  .cat-name  { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 0.18rem; }
  .cat-count { font-size: 0.67rem; color: var(--copper-lt); font-weight: 500; }

  .cat-bar {
    position: absolute; top: 0; left: 0;
    height: 2px; width: 0;
    background: linear-gradient(90deg, var(--copper), var(--copper-lt));
    transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .cat-card:hover .cat-bar { width: 100%; }

  /* ══ FEATURES ══ */
  .feat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 900px) { .feat-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .feat-grid { grid-template-columns: 1fr; } }

  .feat-card {
    background: var(--bg-card);
    border: 1px solid var(--bdr);
    border-radius: 12px; padding: 1.8rem 1.5rem;
    position: relative; overflow: hidden;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(15,30,66,0.05);
  }
  .feat-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    height: 2px; width: 0;
    background: linear-gradient(90deg, var(--copper), transparent);
    transition: width 0.4s ease;
  }
  .feat-card:hover { border-color: rgba(212,130,58,0.3); transform: translateY(-3px); box-shadow: 0 12px 28px rgba(15,30,66,0.1); }
  .feat-card:hover::after { width: 100%; }

  .feat-ico {
    width: 2.6rem; height: 2.6rem; border-radius: 9px;
    background: var(--copper-pale);
    border: 1px solid rgba(212,130,58,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--copper-dk); margin-bottom: 1.1rem;
    transition: all 0.3s;
  }
  .feat-card:hover .feat-ico {
    background: linear-gradient(135deg, var(--copper), var(--copper-dk));
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 12px rgba(212,130,58,0.3);
  }
  .feat-ttl { font-size: 0.92rem; font-weight: 700; color: var(--ink); margin-bottom: 0.4rem; }
  .feat-dsc { font-size: 0.78rem; color: var(--ink-3); line-height: 1.65; }

  /* ══ CTA FOOTER ══ */
  .cta-foot {
    background: linear-gradient(135deg, var(--navy), var(--navy-mid), var(--navy-lt));
    padding: 4rem clamp(1.5rem, 6vw, 6rem);
    text-align: center; position: relative; overflow: hidden;
  }
  .cta-foot::before {
    content: '';
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(212,130,58,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .cf-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--copper-lt); margin-bottom: 0.9rem; position: relative; }
  .cf-ttl { font-size: clamp(1.7rem, 2.8vw, 2.6rem); font-weight: 800; color: #fff; margin-bottom: 0.8rem; line-height: 1.2; position: relative; }
  .cf-sub { font-size: 0.9rem; color: rgba(220,228,255,0.7); margin-bottom: 2.2rem; max-width: 48ch; margin-left: auto; margin-right: auto; line-height: 1.7; position: relative; }
  .cf-actions { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; position: relative; }

  /* ══ REVEAL ══ */
  .rv { opacity: 0; transform: translateY(20px); transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }
  .rv.vis { opacity: 1; transform: translateY(0); }
  .d1{transition-delay:0.05s} .d2{transition-delay:0.12s} .d3{transition-delay:0.19s} .d4{transition-delay:0.26s}

  @keyframes fsu { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
`

/* ─── Data ─── */
const tickers = [
  'Koleksi Lengkap','✦','Pengiriman Cepat','✦','Buku 100% Original','✦',
  'Harga Terbaik','✦','Gratis Ongkir','✦','Edisi Terbaru','✦','Penulis Lokal & Internasional','✦',
  'Koleksi Lengkap','✦','Pengiriman Cepat','✦','Buku 100% Original','✦',
  'Harga Terbaik','✦','Gratis Ongkir','✦','Edisi Terbaru','✦','Penulis Lokal & Internasional','✦',
]

const chips = [
  {l:'All Books',ic:'📚'},{l:"Al-Qur'an",ic:'📖'},{l:'Pre-Order',ic:'🔖'},
  {l:'New Arrival',ic:'✨'},{l:'Fiksi',ic:'🌟'},{l:'Non-Fiksi',ic:'💡'},
  {l:'Komik & Manga',ic:'🎨'},{l:'Anak-Anak',ic:'🧒'},{l:'Akademik',ic:'🎓'},{l:'Agama',ic:'🕌'},
]

const features = [
  { Icon: BookOpen,   t:'10.000+ Judul Buku',  d:'Buku lokal & internasional dari berbagai genre tersedia lengkap.' },
  { Icon: Truck,      t:'Pengiriman 1–3 Hari', d:'Pengiriman cepat & aman ke seluruh pelosok Indonesia.' },
  { Icon: Shield,     t:'Garansi 100% Asli',   d:'Semua buku original resmi dengan garansi pengembalian penuh.' },
  { Icon: Headphones, t:'Dukungan 24/7',       d:'Customer service siap membantu kapan pun kamu butuhkan.' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ─── Component ─── */
const Home = () => {
  const [books, setBooks] = useState([])
  const [cats,  setCats]  = useState([])
  const { user } = useAuth() // ← cek status login
  useReveal()

  useEffect(() => {
    Promise.all([api.get('/books?limit=4'), api.get('/categories')])
      .then(([b, c]) => { setBooks(b.data.books); setCats(c.data) })
      .catch(console.error)
  }, [])

  return (
    <div className="hr">
      <style>{styles}</style>

      {/* PROMO BAR */}
      <div className="promo-bar">
        🎉 Promo Spesial — Diskon hingga <strong>35%</strong> untuk koleksi buku pilihan! Gratis ongkir min. pembelian Rp 100.000
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-badge"><span className="badge-dot" /> Special Offer · Terbatas</div>
            <h1 className="hero-title">
              Temukan Buku<br /><span className="hl">Favoritmu</span> Di Sini
            </h1>
            <p className="hero-desc">
              Koleksi lebih dari 10.000 judul buku dari penulis lokal & internasional.
              Harga terbaik, pengiriman cepat, garansi original.
            </p>
            <div className="hero-ctas">
              <Link to="/books" className="btn-copper">Jelajahi Katalog <ArrowRight size={15} /></Link>
              {/* Tombol Daftar hanya muncul jika belum login */}
              {!user && <Link to="/register" className="btn-ghost-w">Daftar Gratis</Link>}
            </div>
            <div className="hero-stats">
              {[['10K','+','Judul Buku'],['50K','+','Pembaca'],['4.9','★','Rating']].map(([n,s,l]) => (
                <div key={l}>
                  <div className="hs-num">{n}<em>{s}</em></div>
                  <div className="hs-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hb-main"><img src={HeroMain} alt="Kelola Buku" /></div>
            <div className="hb-sm"><img src={HeroSec} alt="" /></div>
            <div className="hb-promo">
              <div className="hbp-lbl">Diskon Hari Ini</div>
              <div className="hbp-num">35%</div>
              <div className="hbp-sub">Buku Pilihan</div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {tickers.map((t, i) => (
            <span key={i} className="t-item">
              {t === '✦' ? <span className="t-sep">✦</span> : t}
            </span>
          ))}
        </div>
      </div>

      {/* CHIPS */}
      <div className="chips-wrap">
        <div className="chips-row">
          {chips.map((c, i) => (
            <Link key={i} to={`/books?q=${c.l}`} className={`chip${i===0?' active':''}`}>
              {c.ic} {c.l}
            </Link>
          ))}
        </div>
      </div>

      {/* BOOKS */}
      <section className="section sec-w">
        <div className="inner">
          <div className="sec-head rv">
            <div className="sec-head-l">
              <div className="sec-ico"><Sparkles size={13} /></div>
              <div><div className="sec-ttl">Buku Populer</div><div className="sec-sub">Pilihan terlaris minggu ini</div></div>
            </div>
            <Link to="/books" className="link-all">Lihat Semua <ChevronRight size={13} /></Link>
          </div>
          <div className="books-grid">
            {books.map((b, i) => (
              <div key={b.id} className={`rv d${(i%4)+1}`}><BookCard book={b} /></div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PROMO STRIP */}
      <section className="section sec-w">
        <div className="promo-strip rv">
          <div>
            <div className="ps-lbl">🔥 Penawaran Terbatas</div>
            <div className="ps-ttl">Diskon spesial <em>35%</em> untuk<br />koleksi buku komik &amp; manga</div>
          </div>
          <Link to="/books?promo=1" className="btn-copper">Klaim Sekarang <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section sec-wh">
        <div className="inner">
          <div className="sec-head rv">
            <div className="sec-head-l">
              <div className="sec-ico"><Tag size={13} /></div>
              <div><div className="sec-ttl">Kategori Terlaris</div><div className="sec-sub">Jelajahi berdasarkan genre favorit</div></div>
            </div>
            <Link to="/books" className="link-all">Semua Kategori <ChevronRight size={13} /></Link>
          </div>
          <div className="cat-grid">
            {(cats.length ? cats : Array.from({length:8},(_,i)=>({id:i,name:'Kategori '+i,_count:{books:0}}))).map((c, i) => (
              <Link key={c.id} to={`/books?category=${c.id}`} className={`cat-card rv d${(i%4)+1}`}>
                <div className="cat-bg"><div className="cat-num-bg">0{i+1}</div></div>
                <div className="cat-overlay">
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c._count?.books||0} judul</div>
                </div>
                <span className="cat-bar" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section className="section sec-w">
        <div className="inner">
          <div className="sec-head rv">
            <div className="sec-head-l">
              <div className="sec-ico"><Star size={13} /></div>
              <div><div className="sec-ttl">Kenapa Belanja di Sini?</div><div className="sec-sub">Kepercayaan dan kenyamanan adalah prioritas kami</div></div>
            </div>
          </div>
          <div className="feat-grid">
            {features.map(({Icon,t,d},i) => (
              <div key={i} className={`feat-card rv d${i+1}`}>
                <div className="feat-ico"><Icon size={15} /></div>
                <div className="feat-ttl">{t}</div>
                <div className="feat-dsc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER — hanya tampil jika belum login */}
      {!user && (
        <section className="cta-foot">
          <div className="cf-eyebrow">Bergabung Sekarang</div>
          <h2 className="cf-ttl">Belum punya akun? Daftar gratis sekarang!</h2>
          <p className="cf-sub">
            Nikmati akses ke ribuan judul buku, promo eksklusif member,
            dan pengalaman belanja buku terbaik di Indonesia.
          </p>
          <div className="cf-actions">
            <Link to="/register" className="btn-copper">Daftar Gratis <ArrowRight size={14} /></Link>
            <Link to="/books" className="btn-ghost-w">Lihat Katalog</Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
