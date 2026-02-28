import { BookOpen, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  :root {
    --fn-navy:        #0f1e42;
    --fn-navy-mid:    #162544;
    --fn-navy-dk:     #09132b;
    --fn-copper:      #d4823a;
    --fn-copper-lt:   #e8a060;
    --fn-border:      rgba(255,255,255,0.08);
    --fn-border-dk:   rgba(255,255,255,0.04);
    --fn-muted:       rgba(200,215,255,0.5);
    --fn-muted-hover: rgba(255,255,255,0.88);
  }

  .footer-root {
    font-family: 'Poppins', sans-serif;
    background: var(--fn-navy-mid);
    color: #fff;
    position: relative;
    overflow: hidden;
  }

  /* ══ STRIP — copper accent, clearly separated ══ */
  .footer-strip {
    background: linear-gradient(90deg, #b06828 0%, var(--fn-copper) 40%, #c97832 70%, #b06828 100%);
    padding: 0.72rem clamp(1.5rem, 6vw, 5rem);
    display: flex; align-items: center; justify-content: center; gap: 2rem;
    flex-wrap: wrap; position: relative; overflow: hidden;
  }
  /* shimmer */
  .footer-strip::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: stripShimmer 4s ease-in-out infinite;
  }
  @keyframes stripShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

  .footer-strip-item {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: #fff; position: relative; z-index: 1;
  }
  .footer-strip-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(255,255,255,0.4);
  }

  /* ══ MAIN BODY — slightly lighter navy ══ */
  .footer-body {
    max-width: 1400px; margin: 0 auto;
    padding: 3.5rem clamp(1.5rem, 6vw, 5rem) 2.75rem;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 3rem;
    position: relative; z-index: 1;
    background: var(--fn-navy-mid);
  }
  @media (max-width: 1024px) { .footer-body { grid-template-columns: 1fr 1fr; gap: 2.5rem; } }
  @media (max-width: 600px)  { .footer-body { grid-template-columns: 1fr; gap: 2rem; } }

  /* Subtle top glow on body */
  .footer-body::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,130,58,0.3), transparent);
  }

  /* Brand */
  .footer-brand-logo {
    display: flex; align-items: center; gap: 0.65rem;
    text-decoration: none; margin-bottom: 1.2rem;
  }
  .footer-brand-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px; transition: all 0.25s;
  }
  .footer-brand-logo:hover .footer-brand-icon {
    background: rgba(212,130,58,0.2);
    border-color: rgba(212,130,58,0.4);
    transform: scale(1.08) rotate(-3deg);
  }
  .footer-brand-icon svg { color: rgba(255,255,255,0.85); }
  .footer-brand-name { font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
  /* Tone-down: name is all white, no orange accent */

  .footer-brand-desc {
    font-size: 0.82rem; color: var(--fn-muted);
    line-height: 1.8; font-weight: 300;
    margin-bottom: 1.5rem; max-width: 28ch;
  }

  /* Social */
  .footer-socials { display: flex; gap: 0.55rem; }
  .footer-social-btn {
    width: 33px; height: 33px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--fn-border);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--fn-muted); cursor: pointer;
    transition: all 0.22s; text-decoration: none;
  }
  .footer-social-btn:hover {
    background: rgba(212,130,58,0.15);
    border-color: rgba(212,130,58,0.35);
    color: var(--fn-copper-lt);
    transform: translateY(-2px);
  }

  /* Column titles */
  .footer-col-title {
    font-size: 0.67rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 0.65rem;
  }
  .footer-col-title::after {
    content: ''; flex: 1; height: 1px;
    background: var(--fn-border);
  }

  /* Links */
  .footer-links { display: flex; flex-direction: column; gap: 0.52rem; }
  .footer-link {
    font-size: 0.82rem; color: var(--fn-muted); font-weight: 400;
    text-decoration: none; transition: color 0.2s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .footer-link::before {
    content: ''; width: 0; height: 1px;
    background: var(--fn-copper-lt);
    transition: width 0.25s ease; flex-shrink: 0;
  }
  .footer-link:hover { color: var(--fn-muted-hover); }
  .footer-link:hover::before { width: 10px; }

  /* Contact */
  .footer-contact-item {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.81rem; color: var(--fn-muted);
    margin-bottom: 0.7rem; line-height: 1.5;
  }
  .footer-contact-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--fn-border);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.4);
  }

  /* ══ BOTTOM BAR — darkest zone ══ */
  .footer-bottom-wrap {
    background: var(--fn-navy-dk);
  }
  .footer-bottom {
    max-width: 1400px; margin: 0 auto;
    padding: 1.25rem clamp(1.5rem, 6vw, 5rem);
    display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  .footer-bottom-copy {
    font-size: 0.71rem; color: rgba(200,215,255,0.3); font-weight: 400;
  }
  .footer-bottom-copy strong { color: rgba(200,215,255,0.5); font-weight: 600; }
  .footer-bottom-links { display: flex; gap: 1.5rem; }
  .footer-bottom-link {
    font-size: 0.71rem; color: rgba(200,215,255,0.3);
    text-decoration: none; transition: color 0.2s;
  }
  .footer-bottom-link:hover { color: var(--fn-copper-lt); }
`

const Footer = () => {
  return (
    <footer className="footer-root">
      <style>{styles}</style>

      {/* Top strip */}
      <div className="footer-strip">
        {['Gratis Ongkir Min. Rp 150.000', 'Buku Original Bergaransi', 'Pengiriman 1–3 Hari Kerja', 'Pembayaran Aman & Terenkripsi'].map((item, i, arr) => (
          <span key={item} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
            <span className="footer-strip-item">{item}</span>
            {i < arr.length - 1 && <span className="footer-strip-dot" />}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="footer-body">

        {/* Brand */}
        <div>
          <Link to="/" className="footer-brand-logo">
            <div className="footer-brand-icon"><BookOpen size={17} /></div>
            <span className="footer-brand-name">BookStore</span>
          </Link>
          <p className="footer-brand-desc">
            Temukan dunia pengetahuan dan imajinasi dalam koleksi buku terbaik kami — dari penulis lokal hingga internasional.
          </p>
          <div className="footer-socials">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="footer-social-btn">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Kategori */}
        <div>
          <div className="footer-col-title">Kategori</div>
          <div className="footer-links">
            {['Fiksi', 'Non-Fiksi', 'Bisnis', 'Teknologi', 'Self-Development', 'Islam'].map(item => (
              <Link key={item} to="/books" className="footer-link">{item}</Link>
            ))}
          </div>
        </div>

        {/* Bantuan */}
        <div>
          <div className="footer-col-title">Bantuan</div>
          <div className="footer-links">
            {['Cara Pembelian', 'Pengiriman', 'Retur & Refund', 'FAQ', 'Syarat & Ketentuan', 'Kebijakan Privasi'].map(item => (
              <a key={item} href="#" className="footer-link">{item}</a>
            ))}
          </div>
        </div>

        {/* Kontak */}
        <div>
          <div className="footer-col-title">Kontak</div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon"><Mail size={13} /></div>
            support@bookstore.com
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon"><Phone size={13} /></div>
            +62 812-3456-7890
          </div>
          <div className="footer-contact-item">
            <div className="footer-contact-icon"><MapPin size={13} /></div>
            Jakarta, Indonesia
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-wrap">
        <div className="footer-bottom">
          <div className="footer-bottom-copy">
            © 2024 <strong>BookStore</strong>. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privasi</a>
            <a href="#" className="footer-bottom-link">Ketentuan</a>
            <a href="#" className="footer-bottom-link">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer